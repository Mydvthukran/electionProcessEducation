/**
 * useElectionAssistant Hook
 * Manages conversation state and logic for the election assistant
 *
 * Features:
 * - Message history management
 * - Async question answering (supports Google Gemini API)
 * - Graceful fallback to rule-based responses
 * - Auto-scroll transcript on new messages
 * - Conversation reset capability
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { getAnswer } from '../services/electionAdvisor.js';

const initialMessages = [
  {
    id: 'assistant-intro',
    role: 'assistant',
    title: 'Assistant',
    type: 'intro',
    text: 'Hello. I can explain the election process in plain language. Ask about registration, timelines, ballot steps, or counting results.',
  },
];

/**
 * Custom hook for managing election assistant conversation state.
 *
 * @returns {Object} Conversation state and interaction handlers:
 *   - messages {Array} - Full conversation history
 *   - status {string} - Current status message shown to users
 *   - question {string} - Current value of the question input
 *   - setQuestion {Function} - Setter for the question input
 *   - topic {string} - Currently selected topic filter
 *   - setTopic {Function} - Setter for the topic filter
 *   - transcriptRef {React.RefObject} - Ref for the transcript container (auto-scroll)
 *   - askAssistant {Function} - Sends a question and retrieves an answer
 *   - clearConversation {Function} - Resets conversation to initial state
 *   - isLoading {boolean} - True while an API call is in flight
 */
export function useElectionAssistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [status, setStatus] = useState('Ready to help');
  const [question, setQuestion] = useState('');
  const [topic, setTopic] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const transcriptRef = useRef(null);

  // Auto-scroll transcript to latest message
  useEffect(() => {
    const container = transcriptRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  /**
   * Appends a message to the conversation transcript.
   *
   * @param {Object} message - Message object to append
   * @private
   */
  const pushMessage = useCallback((message) => {
    setMessages((current) => [...current, message]);
  }, []);

  /**
   * Sends a question to the election assistant and appends the response.
   * Supports both the text input field and externally supplied questions
   * (e.g., from suggested prompt buttons).
   *
   * @param {string} [customQuestion] - Optional override; uses the input field value when omitted.
   * @returns {Promise<boolean>} Resolves to true on success, false on validation failure or error.
   *
   * @example
   * // From the input field
   * await askAssistant();
   *
   * // From a prompt button
   * await askAssistant('How do I register to vote?');
   */
  const askAssistant = useCallback(
    async (customQuestion) => {
      const trimmedQuestion = (customQuestion ?? question).trim();
      if (!trimmedQuestion) {
        setStatus('Type a question to get started');
        return false;
      }

      setIsLoading(true);

      try {
        // Add user message immediately for responsive feel
        pushMessage({
          id: `${Date.now()}-user`,
          role: 'user',
          title: 'You asked',
          type: 'text',
          text: trimmedQuestion,
        });

        // Retrieve answer (async — may call Google Gemini API)
        const { topic: resolvedTopic, data, source } = await getAnswer(trimmedQuestion, topic);

        // Add assistant response
        pushMessage({
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          title: 'Assistant',
          type: 'answer',
          summary: data.summary,
          steps: data.steps,
          next: data.next,
          topic: resolvedTopic,
          query: trimmedQuestion,
          source, // 'gemini' or 'local'
        });

        const sourceLabel = source === 'gemini' ? ' (AI)' : ' (local)';
        setStatus(`Explained ${resolvedTopic}${sourceLabel}`);
        setQuestion('');
        return true;
      } catch (error) {
        console.error('Error asking assistant:', error);
        pushMessage({
          id: `${Date.now()}-error`,
          role: 'assistant',
          title: 'Assistant',
          type: 'error',
          text: 'Sorry, I encountered an error processing your question. Please try again.',
        });
        setStatus('Error processing question');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [question, topic, pushMessage],
  );

  /**
   * Resets the conversation transcript and all state to the initial values.
   */
  const clearConversation = useCallback(() => {
    setMessages(initialMessages);
    setStatus('Chat reset');
    setQuestion('');
    setIsLoading(false);
  }, []);

  return {
    messages,
    status,
    question,
    setQuestion,
    topic,
    setTopic,
    transcriptRef,
    askAssistant,
    clearConversation,
    isLoading,
  };
}