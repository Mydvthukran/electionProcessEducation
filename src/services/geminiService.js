/**
 * Google Gemini AI Service for Election Assistant
 * Provides intelligent context-aware responses using Google's Generative AI
 */

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_API_ENDPOINT = import.meta.env.VITE_GOOGLE_API_ENDPOINT;

export async function getGeminiResponse(question, topic, contextData = null) {
  // Fallback to rule-based system if API key not configured
  if (!GOOGLE_API_KEY) {
    console.warn('Google Gemini API key not configured. Using rule-based responses.');
    return null;
  }

  const systemPrompt = `You are an expert civic education assistant helping users understand election processes.
Your role is to:
- Provide clear, jargon-free explanations
- Give actionable step-by-step guidance
- Always remind users to verify information with official election sources
- Be inclusive and help first-time voters feel confident

Topic Focus: ${topic}
User Question: ${question}

${contextData ? `Additional Context:\n${JSON.stringify(contextData, null, 2)}` : ''}

Provide a structured response with:
1. A brief, clear answer
2. 2-3 actionable steps
3. A "Next step" suggestion
4. A reminder to verify with official sources`;

  try {
    const response = await fetch(`${GOOGLE_API_ENDPOINT}?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 500,
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
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return {
        text: data.candidates[0].content.parts[0].text,
        source: 'gemini',
        timestamp: new Date().toISOString(),
      };
    }

    return null;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
}

/**
 * Validates that the API response is safe and relevant
 */
export function validateGeminiResponse(response) {
  if (!response || !response.text) {
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
  ];
  const hasElectionContext = electionKeywords.some((keyword) => text.includes(keyword));

  // Ensure response length is reasonable
  const isReasonableLength = response.text.length > 50 && response.text.length < 2000;

  return hasElectionContext && isReasonableLength;
}
