/**
 * Election Advisor Service
 * Core business logic for topic detection and intelligent response generation
 * 
 * Provides:
 * - Topic inference from natural language questions
 * - Context-aware answer retrieval
 * - Integration with Google Gemini for AI responses
 * - Fallback to rule-based responses when API unavailable
 */

import { assistantFacts } from '../data/electionContent.js';
import { getGeminiResponse, validateGeminiResponse } from './geminiService.js';

/**
 * Detects user intent by analyzing their question
 * Uses keyword matching to determine which topic they're asking about
 * 
 * @param {string} question - User's question text
 * @param {string} selectedTopic - Currently selected topic override (optional)
 * @returns {string} Topic category: 'registration', 'timeline', 'ballot', 'counting', 'general'
 * 
 * @example
 * inferTopic("How do I register?") // returns "registration"
 * inferTopic("I'm a first-time voter") // returns "registration"
 */
export function inferTopic(question, selectedTopic = 'general') {
  const normalized = question.toLowerCase();

  // If user explicitly selected a topic, respect that
  if (selectedTopic && selectedTopic !== 'general') {
    return selectedTopic;
  }

  // First-time voter always routes to registration
  if (/(first[- ]time|first time|new voter|voting for the first time)/.test(normalized)) {
    return 'registration';
  }

  // Registration keywords
  if (/(register|registration|registered|deadline|roll|eligible|eligible voter)/.test(normalized)) {
    return 'registration';
  }

  // Timeline/deadline keywords
  if (/(when|timeline|date|calendar|before|after|deadline)/.test(normalized)) {
    return 'timeline';
  }

  // Ballot/voting options keywords
  if (/(ballot|early|mail|absentee|poll|voting location|how to vote)/.test(normalized)) {
    return 'ballot';
  }

  // Vote counting keywords
  if (/(count|results|certify|tally|verify|how are votes counted)/.test(normalized)) {
    return 'counting';
  }

  // Default to general for other questions
  return 'general';
}

/**
 * Retrieves answer for a user question with intelligent fallback logic
 * 
 * Approach:
 * 1. Detect question topic (keyword matching)
 * 2. Try to get AI response from Google Gemini
 * 3. Fallback to rule-based response if AI unavailable
 * 4. Structure response with context metadata
 * 
 * @param {string} question - User's question
 * @param {string} selectedTopic - Previously selected topic (for context)
 * @returns {Promise<Object>} Response object with topic, data, and source
 * @returns {string} .topic - Detected topic category
 * @returns {Object} .data - Answer object (summary, steps, next)
 * @returns {string} .source - "gemini" or "local"
 * 
 * @example
 * const response = await getAnswer("Can I vote by mail?");
 * console.log(response.data.steps); // ["Step 1", "Step 2", ...]
 */
export async function getAnswer(question, selectedTopic = 'general') {
  const topic = inferTopic(question, selectedTopic);
  const contextData = assistantFacts[topic] ?? assistantFacts.general;

  // Try AI response first if available
  try {
    const geminiResponse = await getGeminiResponse(question, topic, contextData);
    if (geminiResponse && validateGeminiResponse(geminiResponse)) {
      return {
        topic,
        data: parseAIResponse(geminiResponse.text),
        source: 'gemini',
        timestamp: geminiResponse.timestamp,
      };
    }
  } catch (error) {
    console.warn('Gemini API error, using fallback:', error.message);
  }

  // Fallback to rule-based response
  return {
    topic,
    data: contextData,
    source: 'local',
  };
}

/**
 * Parses AI response text into structured format
 * Extracts summary, steps, and next action from raw text
 * 
 * @param {string} text - Raw response text from Gemini
 * @returns {Object} Structured response with summary, steps, next
 * @private
 */
function parseAIResponse(text) {
  const lines = text.split('\n').filter((line) => line.trim());
  
  return {
    summary: lines[0] || text.substring(0, 100),
    steps: extractSteps(text),
    next: extractNext(text),
  };
}

/**
 * Extracts numbered or bulleted steps from response text
 * @private
 */
function extractSteps(text) {
  const stepPattern = /^\s*(?:\d+\.|[-*])\s+(.+)$/gm;
  const matches = text.matchAll(stepPattern);
  const steps = Array.from(matches)
    .map((match) => match[1].trim())
    .slice(0, 5); // Limit to 5 steps

  return steps.length > 0 ? steps : ['Follow the guidance above'];
}

/**
 * Extracts next action/recommendation from response text
 * @private
 */
function extractNext(text) {
  const nextPatterns = [
    /Next step:?\s*(.+?)(?:\n|$)/i,
    /Then:?\s*(.+?)(?:\n|$)/i,
    /Finally:?\s*(.+?)(?:\n|$)/i,
  ];

  for (const pattern of nextPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return 'Verify with your local election office for exact deadlines and procedures.';
}
