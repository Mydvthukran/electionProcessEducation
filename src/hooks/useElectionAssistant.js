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

import { useEffect, useRef, useState } from 'react';
import { getAnswer } from '../services/electionAdvisor.js';

const initialMessages = [
  {
    id: 'assistant-intro',
    role: 'assistant',
    title: 'Assistant',
    type: 'intro',
    text:
      'Hello. I can explain the election process in plain language. Ask about registration, timelines, ballot steps, or counting results.',
  },
];

/**
 * Custom hook for managing election assistant conversation
 * @returns {Object} Conversation state and handlers
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
   * Adds a message to the conversation
   * @param {Object} message - Message to add
   * @private
   */
  function pushMessage(message) {
    setMessages((current) => [...current, message]);
  }

  /**
   * Asks the assistant a question
   * Supports both text input and custom questions
   * Uses Google Gemini API when available, falls back to local responses
   * 
   * @param {string} customQuestion - Optional custom question (overrides input field)
   * @returns {Promise<boolean>} True if question was asked, false if validation failed
   * 
   * @example
   * // Using input field
   * await askAssistant();
   * 
   * // Using custom question
   * await askAssistant("How do I register to vote?");
   */
  async function askAssistant(customQuestion) {
    const trimmedQuestion = (customQuestion ?? question).trim();
    if (!trimmedQuestion) {
      setStatus('Type a question to get started');
      return false;
    }

    setIsLoading(true);

    try {
      // Add user message immediately
      pushMessage({
        id: `${Date.now()}-user`,
        role: 'user',
        title: 'You asked',
        type: 'text',
        text: trimmedQuestion,
      });

      // Get answer (async, supports Gemini API)
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

      // Update status to show data source
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
        text: 'Sorry, I encountered an error. Please try again.',
      });
      setStatus('Error processing question');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Clears conversation and resets to initial state
   */
  function clearConversation() {
    setMessages(initialMessages);
    setStatus('Chat reset');
    setQuestion('');
    setIsLoading(false);
  }

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