/**
 * Validation and Testing Suite for Election Assistant
 * Ensures data integrity, accessibility, and functionality
 */

import { inferTopic } from './electionAdvisor.js';
import {
  assistantFacts,
  timelineSteps,
  featureCards,
  quickFacts,
  demoScenarios,
} from '../data/electionContent.js';

/**
 * Validates that all required data structures exist and are properly formatted.
 *
 * @returns {{ valid: boolean, errors: string[] }}
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
      } else if (data.steps.length < 2) {
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
 * Tests topic inference logic using the synchronous inferTopic function.
 * (getAnswer is async and requires the full service chain — use inferTopic
 * for unit tests of the keyword-matching logic.)
 *
 * @returns {{ totalTests: number, passed: number, failed: number, results: Array }}
 */
export function testTopicInference() {
  const testCases = [
    { input: 'How do I register to vote?', expected: 'registration' },
    { input: 'When is election day?', expected: 'timeline' },
    { input: 'Can I vote by mail?', expected: 'ballot' },
    { input: 'How are votes counted?', expected: 'counting' },
    { input: 'I am voting for the first time', expected: 'registration' },
    { input: 'What is a ballot?', expected: 'ballot' },
    { input: 'What is the registration deadline?', expected: 'registration' },
    { input: 'Where is my polling location?', expected: 'ballot' },
    { input: 'How long does ballot counting take?', expected: 'counting' },
    { input: 'Tell me about early voting', expected: 'ballot' },
  ];

  const results = testCases.map((testCase) => {
    // inferTopic is synchronous — safe to call directly
    const actual = inferTopic(testCase.input, 'general');
    const passed = actual === testCase.expected;
    return {
      input: testCase.input,
      expected: testCase.expected,
      actual,
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
 * Validates accessibility compliance by checking that required DOM element
 * IDs are present. Only runs in browser environments.
 *
 * @returns {{ compliant: boolean, issues: string[], recommendations: string[] }}
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
      'Use semantic HTML (article, section, header, footer, main, ol/ul for lists)',
      'Ensure all interactive elements are keyboard accessible',
      'Use ARIA labels and roles for screen readers',
      'Maintain sufficient color contrast (WCAG 2.1 AA: 4.5:1 for normal text)',
      'Support keyboard navigation with Tab, Enter, and Arrow keys',
      'Use aria-live regions for dynamic content updates',
      'Provide skip-to-content links for keyboard users',
    ],
  };
}

/**
 * Performance validation — checks content metrics and flags inefficiencies.
 *
 * @returns {{ metrics: Object, efficient: boolean }}
 */
export function validatePerformance() {
  const topicValues = Object.values(assistantFacts);
  const totalSteps = topicValues.reduce((sum, data) => sum + data.steps.length, 0);
  const totalTopics = Object.keys(assistantFacts).length;

  const metrics = {
    totalTopics,
    totalSteps,
    avgStepsPerTopic: totalSteps / totalTopics,
    timelineStepsCount: timelineSteps.length,
    featureCardsCount: featureCards.length,
    quickFactsCount: quickFacts.length,
    demoScenariosCount: demoScenarios.length,
  };

  return {
    metrics,
    efficient:
      metrics.avgStepsPerTopic >= 2 &&
      metrics.totalTopics >= 5 &&
      metrics.quickFactsCount >= 3 &&
      metrics.demoScenariosCount >= 3,
  };
}

/**
 * Runs all validation tests and returns a combined report.
 *
 * @returns {{ dataStructure: Object, topicInference: Object, accessibility: Object, performance: Object, timestamp: string }}
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

// Auto-run validations in development (non-blocking)
if (import.meta.env.DEV) {
  // Defer so components have time to mount before DOM checks run
  setTimeout(() => {
    const results = runAllValidations();
    console.group('🧪 Election Assistant Validation Report');
    console.log('Data structure:', results.dataStructure);
    console.log('Topic inference:', results.topicInference);
    console.log('Accessibility:', results.accessibility);
    console.log('Performance:', results.performance);
    if (!results.dataStructure.valid) {
      console.error('❌ Data structure errors:', results.dataStructure.errors);
    } else {
      console.log('✅ Data structure valid');
    }
    if (results.topicInference.failed > 0) {
      console.warn(`⚠️ Topic inference: ${results.topicInference.failed} tests failed`);
      results.topicInference.results
        .filter((r) => !r.passed)
        .forEach((r) => console.warn(`  ✗ "${r.input}" → expected "${r.expected}", got "${r.actual}"`));
    } else {
      console.log(`✅ Topic inference: ${results.topicInference.passed}/${results.topicInference.totalTests} tests passed`);
    }
    if (!results.accessibility.compliant) {
      console.warn('⚠️ Accessibility issues:', results.accessibility.issues);
    } else {
      console.log('✅ Accessibility: all required elements present');
    }
    console.groupEnd();
  }, 1000);
}
