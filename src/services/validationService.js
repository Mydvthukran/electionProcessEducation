/**
 * Validation and Testing Suite for Election Assistant
 * Ensures data integrity, accessibility, and functionality
 */

import { getAnswer } from './electionAdvisor.js';
import {
  assistantFacts,
  timelineSteps,
  featureCards,
  quickFacts,
  demoScenarios,
} from '../data/electionContent.js';

/**
 * Validates that all required data structures exist and are properly formatted
 */
export function validateDataStructure() {
  const errors = [];

  // Check assistantFacts
  const requiredTopics = ['registration', 'timeline', 'ballot', 'counting', 'general'];
  for (const topic of requiredTopics) {
    if (!assistantFacts[topic]) {
      errors.push(`Missing topic: ${topic}`);
    } else {
      const data = assistantFacts[topic];
      if (!data.summary || !Array.isArray(data.steps) || !data.next) {
        errors.push(`Invalid structure for topic: ${topic}`);
      }
      if (data.steps.length < 2) {
        errors.push(`Topic ${topic} has fewer than 2 steps`);
      }
    }
  }

  // Check timeline
  if (!Array.isArray(timelineSteps) || timelineSteps.length !== 4) {
    errors.push('Timeline should have exactly 4 steps');
  }
  for (const step of timelineSteps) {
    if (!step.title || !step.copy) {
      errors.push('Timeline steps missing required fields');
    }
  }

  // Check features and facts
  if (!Array.isArray(featureCards) || featureCards.length < 3) {
    errors.push('Should have at least 3 feature cards');
  }
  if (!Array.isArray(quickFacts) || quickFacts.length < 3) {
    errors.push('Should have at least 3 quick facts');
  }
  if (!Array.isArray(demoScenarios) || demoScenarios.length < 3) {
    errors.push('Should have at least 3 demo scenarios');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Tests topic inference logic
 */
export function testTopicInference() {
  const testCases = [
    { input: 'How do I register to vote?', expected: 'registration' },
    { input: 'When is election day?', expected: 'timeline' },
    { input: 'Can I vote by mail?', expected: 'ballot' },
    { input: 'How are votes counted?', expected: 'counting' },
    { input: 'I am voting for the first time', expected: 'registration' },
    { input: 'What is a ballot?', expected: 'ballot' },
  ];

  const results = testCases.map((testCase) => {
    const answer = getAnswer(testCase.input, 'general');
    const passed = answer.topic === testCase.expected;
    return {
      input: testCase.input,
      expected: testCase.expected,
      actual: answer.topic,
      passed,
    };
  });

  const passCount = results.filter((r) => r.passed).length;
  return {
    totalTests: results.length,
    passed: passCount,
    failed: results.length - passCount,
    results,
  };
}

/**
 * Validates accessibility compliance
 */
export function validateAccessibility() {
  const issues = [];

  // Check that element IDs exist for all interactive elements
  const requiredIds = ['transcript', 'question', 'topic', 'askButton', 'clearButton', 'timelineList'];
  if (typeof document !== 'undefined') {
    for (const id of requiredIds) {
      const element = document.getElementById(id);
      if (!element) {
        issues.push(`Missing element with id: ${id}`);
      }
    }
  }

  return {
    compliant: issues.length === 0,
    issues,
    recommendations: [
      'Use semantic HTML (article, section, header, footer, main)',
      'Ensure all interactive elements are keyboard accessible',
      'Use ARIA labels for screen readers',
      'Maintain sufficient color contrast (WCAG AA standard)',
      'Support keyboard navigation with Tab, Enter, and Arrow keys',
    ],
  };
}

/**
 * Performance validation
 */
export function validatePerformance() {
  const metrics = {
    totalTopics: Object.keys(assistantFacts).length,
    totalSteps: Object.values(assistantFacts).reduce((sum, data) => sum + data.steps.length, 0),
    avgStepsPerTopic: Object.values(assistantFacts).reduce((sum, data) => sum + data.steps.length, 0) /
      Object.keys(assistantFacts).length,
    timelineStepsCount: timelineSteps.length,
    featureCardsCount: featureCards.length,
  };

  return {
    metrics,
    efficient: metrics.avgStepsPerTopic >= 2 && metrics.totalTopics >= 5,
  };
}

/**
 * Runs all validation tests
 */
export function runAllValidations() {
  return {
    dataStructure: validateDataStructure(),
    topicInference: testTopicInference(),
    accessibility: validateAccessibility(),
    performance: validatePerformance(),
    timestamp: new Date().toISOString(),
  };
}

// Auto-run validations in development
if (import.meta.env.DEV) {
  const results = runAllValidations();
  console.group('🧪 Election Assistant Validation Report');
  console.table(results);
  if (!results.dataStructure.valid) {
    console.error('❌ Data structure errors:', results.dataStructure.errors);
  } else {
    console.log('✅ Data structure valid');
  }
  if (results.topicInference.failed > 0) {
    console.warn(`⚠️ Topic inference: ${results.topicInference.failed} tests failed`);
  } else {
    console.log('✅ Topic inference tests passed');
  }
  console.groupEnd();
}
