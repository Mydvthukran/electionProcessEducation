/**
 * ProcessTracker Component
 *
 * An interactive 6-step voter journey tracker that lets users check off
 * each step of the election process as they complete it. Features:
 * - Animated progress bar showing overall completion
 * - Expandable step detail panels
 * - Persistent completion state via localStorage
 * - Keyboard accessible (Tab + Enter/Space to toggle steps)
 * - ARIA live region announces progress to screen readers
 */

import { useCallback, useEffect, useReducer } from 'react';
import { processSteps } from '../data/electionContent.js';

// ── Constants ─────────────────────────────────────────────────────────────────

/** localStorage key for persisting checked steps across page loads. */
const STORAGE_KEY = 'electionTracker_completed';

// ── State helpers ─────────────────────────────────────────────────────────────

/**
 * Loads persisted step IDs from localStorage.
 * @returns {Set<string>}
 */
function loadPersistedSteps() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

/**
 * @typedef {Object} TrackerState
 * @property {Set<string>} completed  - IDs of completed steps
 * @property {string|null} expanded   - ID of the currently expanded step, or null
 */

/** @returns {TrackerState} */
function makeInitialState() {
  return { completed: loadPersistedSteps(), expanded: null };
}

/**
 * Pure reducer for tracker state.
 * @param {TrackerState} state
 * @param {{ type: string, payload?: string }} action
 * @returns {TrackerState}
 */
function trackerReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_COMPLETE': {
      const next = new Set(state.completed);
      if (next.has(action.payload)) {
        next.delete(action.payload);
      } else {
        next.add(action.payload);
      }
      return { ...state, completed: next };
    }
    case 'TOGGLE_EXPAND':
      return {
        ...state,
        expanded: state.expanded === action.payload ? null : action.payload,
      };
    case 'RESET':
      return { completed: new Set(), expanded: null };
    default:
      return state;
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

/**
 * @param {{
 *   step: import('../data/electionContent.js').ProcessStep,
 *   isCompleted: boolean,
 *   isExpanded: boolean,
 *   onToggleComplete: (id: string) => void,
 *   onToggleExpand: (id: string) => void,
 * }} props
 */
function TrackerStep({ step, isCompleted, isExpanded, onToggleComplete, onToggleExpand }) {
  const checkboxId = `tracker-check-${step.id}`;
  const detailsId  = `tracker-details-${step.id}`;

  return (
    <li
      className={`tracker-step${isCompleted ? ' tracker-step--done' : ''}`}
      aria-label={`Step ${step.number}: ${step.title}${isCompleted ? ' — completed' : ''}`}
    >
      {/* Step header row */}
      <div className="tracker-step-header">
        {/* Completion checkbox */}
        <label className="tracker-checkbox-label" htmlFor={checkboxId}>
          <input
            id={checkboxId}
            type="checkbox"
            className="tracker-checkbox"
            checked={isCompleted}
            onChange={() => onToggleComplete(step.id)}
            aria-label={`Mark "${step.title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
          />
          <span className="tracker-custom-check" aria-hidden="true">
            {isCompleted ? '✓' : ''}
          </span>
        </label>

        {/* Step icon + title */}
        <button
          className="tracker-step-btn"
          type="button"
          aria-expanded={isExpanded}
          aria-controls={detailsId}
          onClick={() => onToggleExpand(step.id)}
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for step ${step.number}: ${step.title}`}
        >
          <span className="tracker-step-icon" aria-hidden="true">{step.icon}</span>
          <span className="tracker-step-number" aria-hidden="true">{step.number}</span>
          <span className="tracker-step-title">{step.title}</span>
          <span className="tracker-chevron" aria-hidden="true">{isExpanded ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Expanded detail panel */}
      {isExpanded && (
        <div
          id={detailsId}
          className="tracker-step-details"
          role="region"
          aria-label={`Details for ${step.title}`}
        >
          <p className="tracker-step-desc">{step.description}</p>
          <ul className="tracker-detail-list" aria-label={`Action items for ${step.title}`}>
            {step.details.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="tracker-tip">
            <span aria-hidden="true">💡 </span>
            <strong>Tip: </strong>{step.tip}
          </p>
        </div>
      )}
    </li>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * ProcessTracker – interactive 6-step voter journey checklist.
 * Completion state persists in localStorage between sessions.
 */
export default function ProcessTracker() {
  const [state, dispatch] = useReducer(trackerReducer, undefined, makeInitialState);

  const completedCount = state.completed.size;
  const totalSteps     = processSteps.length;
  const progressPct    = Math.round((completedCount / totalSteps) * 100);

  // Persist completed steps on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.completed]));
    } catch {
      // localStorage may be unavailable (e.g. private browsing with strict settings)
    }
  }, [state.completed]);

  const handleToggleComplete = useCallback(
    (id) => dispatch({ type: 'TOGGLE_COMPLETE', payload: id }),
    [],
  );

  const handleToggleExpand = useCallback(
    (id) => dispatch({ type: 'TOGGLE_EXPAND', payload: id }),
    [],
  );

  const handleReset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return (
    <section
      className="tracker-container"
      aria-label="Voter journey process tracker"
      id="processTracker"
    >
      {/* Header */}
      <div className="tracker-header">
        <div>
          <h3 className="tracker-heading">Your Voter Journey</h3>
          <p className="tracker-subheading">
            Check off each step as you complete it. Progress saves automatically.
          </p>
        </div>
        {completedCount > 0 && (
          <button
            className="button secondary tracker-reset-btn"
            type="button"
            onClick={handleReset}
            aria-label="Reset all completed steps"
          >
            Reset
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="tracker-progress-wrap">
        <div
          className="tracker-progress-bar"
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${completedCount} of ${totalSteps} steps completed`}
        >
          <div
            className="tracker-progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p
          className="tracker-progress-label"
          aria-live="polite"
          aria-atomic="true"
        >
          {completedCount === totalSteps
            ? '🎉 All steps complete — you\'re ready to vote!'
            : `${completedCount} of ${totalSteps} steps completed (${progressPct}%)`}
        </p>
      </div>

      {/* Steps list */}
      <ol
        className="tracker-steps-list"
        aria-label="Voter journey steps"
      >
        {processSteps.map((step) => (
          <TrackerStep
            key={step.id}
            step={step}
            isCompleted={state.completed.has(step.id)}
            isExpanded={state.expanded === step.id}
            onToggleComplete={handleToggleComplete}
            onToggleExpand={handleToggleExpand}
          />
        ))}
      </ol>
    </section>
  );
}
