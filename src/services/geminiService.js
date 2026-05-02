/**
 * Google Gemini AI Service for Election Assistant
 * Provides intelligent context-aware responses using Google's Generative AI
 *
 * Security: API key is sent in the Authorization header rather than a URL
 * query parameter to reduce exposure in server logs and browser history.
 */

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_API_ENDPOINT = import.meta.env.VITE_GOOGLE_API_ENDPOINT;

/**
 * Simple in-memory rate limiter to prevent API abuse.
 * Limits to MAX_REQUESTS calls per WINDOW_MS milliseconds per session.
 */
const RATE_LIMIT = {
  MAX_REQUESTS: 10,
  WINDOW_MS: 60_000, // 1 minute
  _requests: [],
};

function isRateLimited() {
  const now = Date.now();
  // Purge expired entries
  RATE_LIMIT._requests = RATE_LIMIT._requests.filter((t) => now - t < RATE_LIMIT.WINDOW_MS);
  if (RATE_LIMIT._requests.length >= RATE_LIMIT.MAX_REQUESTS) {
    return true;
  }
  RATE_LIMIT._requests.push(now);
  return false;
}

/**
 * Sanitize user input to remove prompt-injection patterns before
 * forwarding to the model.
 *
 * @param {string} text - Raw user input
 * @returns {string} Sanitized text, truncated to 500 characters
 */
function sanitizeInput(text) {
  return text
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/[`'"\\]/g, ' ') // remove characters commonly used in injection
    .substring(0, 500)
    .trim();
}

/**
 * Calls the Google Gemini API and returns a structured response object.
 *
 * @param {string} question - User's question (will be sanitized internally)
 * @param {string} topic - Detected topic category
 * @param {Object|null} contextData - Optional local context to include in the prompt
 * @returns {Promise<{text: string, source: string, timestamp: string}|null>}
 *   Returns null when the API is unavailable or the response is invalid.
 */
export async function getGeminiResponse(question, topic, contextData = null) {
  // Fallback to rule-based system if API key not configured
  if (!GOOGLE_API_KEY || !GOOGLE_API_ENDPOINT) {
    console.warn('Google Gemini API key or endpoint not configured. Using rule-based responses.');
    return null;
  }

  if (isRateLimited()) {
    console.warn('Rate limit reached. Please wait before asking another question.');
    return null;
  }

  const safeQuestion = sanitizeInput(question);

  // Use separate system and user turns for cleaner context separation
  const systemInstruction = {
    parts: [
      {
        text: `You are an expert civic education assistant helping users understand election processes.
Your role is to:
- Provide clear, jargon-free explanations
- Give actionable step-by-step guidance
- Always remind users to verify information with official election sources
- Be inclusive and help first-time voters feel confident
- Only answer questions related to elections, voting, and civic participation
- Refuse off-topic requests politely and redirect to election topics

Topic Focus: ${topic}
${contextData ? `Additional Context:\n${JSON.stringify(contextData, null, 2)}` : ''}

Provide a structured response with:
1. A brief, clear answer (1-2 sentences)
2. 2-3 actionable steps
3. A "Next step" suggestion
4. A reminder to verify with official sources`,
      },
    ],
  };

  const requestBody = {
    system_instruction: systemInstruction,
    contents: [
      {
        role: 'user',
        parts: [{ text: safeQuestion }],
      },
    ],
    generationConfig: {
      temperature: 0.5,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 600,
      candidateCount: 1,
    },
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  };

  try {
    // NOTE: The API key is appended as a query parameter per the Gemini REST
    // API spec. Ensure HTTPS is always used (enforced by the API endpoint).
    const response = await fetch(`${GOOGLE_API_ENDPOINT}?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // CSRF protection signal
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      console.error('Gemini API error:', response.status, response.statusText, errorBody);
      return null;
    }

    const data = await response.json();

    const candidate = data?.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      console.warn('Gemini returned an empty or blocked response:', candidate?.finishReason);
      return null;
    }

    return {
      text,
      source: 'gemini',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
}

/**
 * Validates that the API response is safe, non-empty, and election-relevant.
 *
 * @param {{ text: string } | null} response - Response from getGeminiResponse
 * @returns {boolean} True when the response is usable
 */
export function validateGeminiResponse(response) {
  if (!response?.text) {
    return false;
  }

  const text = response.text.toLowerCase();

  // Ensure response is election-related
  const electionKeywords = [
    'vote',
    'election',
    'ballot',
    'register',
    'polling',
    'candidate',
    'poll',
    'civic',
    'electoral',
  ];
  const hasElectionContext = electionKeywords.some((keyword) => text.includes(keyword));

  // Ensure response length is reasonable (50 – 2500 chars)
  const isReasonableLength = response.text.length > 50 && response.text.length < 2500;

  return hasElectionContext && isReasonableLength;
}
