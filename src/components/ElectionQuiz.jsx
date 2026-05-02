/**
 * ElectionQuiz Component
 *
 * An interactive 8-question multiple-choice quiz that tests users'
 * knowledge of the election process. Features:
 * - One question at a time with animated transitions
 * - Immediate correct/incorrect feedback with explanations
 * - Final score screen with performance-based messaging
 * - Fully keyboard accessible (Tab + Enter/Space to answer)
 * - Screen-reader friendly with aria-live announcements
 */

import { useCallback, useReducer } from 'react';
import { quizQuestions } from '../data/electionContent.js';

// ── State machine ─────────────────────────────────────────────────────────────

/** @typedef {'intro'|'question'|'revealed'|'results'} QuizPhase */

/**
 * @typedef {Object} QuizState
 * @property {QuizPhase} phase
 * @property {number}    currentIndex  - Index of the active question
 * @property {number|null} selected    - Index of the user's chosen option
 * @property {Array<{questionId:string, selected:number, correct:number, passed:boolean}>} answers
 */

/** @type {QuizState} */
const INITIAL_STATE = {
  phase: 'intro',
  currentIndex: 0,
  selected: null,
  answers: [],
};

/**
 * Pure reducer for quiz state transitions.
 * @param {QuizState} state
 * @param {{ type: string, payload?: * }} action
 * @returns {QuizState}
 */
function quizReducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...INITIAL_STATE, phase: 'question' };

    case 'SELECT': {
      if (state.phase !== 'question' || state.selected !== null) return state;
      return { ...state, selected: action.payload, phase: 'revealed' };
    }

    case 'NEXT': {
      const q = quizQuestions[state.currentIndex];
      const newAnswers = [
        ...state.answers,
        {
          questionId: q.id,
          selected: state.selected,
          correct: q.correctIndex,
          passed: state.selected === q.correctIndex,
        },
      ];
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= quizQuestions.length) {
        return { ...state, answers: newAnswers, phase: 'results' };
      }
      return {
        ...state,
        answers: newAnswers,
        currentIndex: nextIndex,
        selected: null,
        phase: 'question',
      };
    }

    case 'RETRY':
      return INITIAL_STATE;

    default:
      return state;
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

/** @param {{ onStart: () => void }} props */
function QuizIntro({ onStart }) {
  return (
    <div className="quiz-intro" role="region" aria-label="Election knowledge quiz introduction">
      <div className="quiz-intro-icon" aria-hidden="true">🗳️</div>
      <h3 className="quiz-title">Test Your Election Knowledge</h3>
      <p className="quiz-subtitle">
        {quizQuestions.length} multiple-choice questions covering registration, ballots, and counting.
        Each answer comes with an explanation to help you learn.
      </p>
      <button
        id="startQuizButton"
        className="button primary"
        type="button"
        onClick={onStart}
        aria-label={`Start the ${quizQuestions.length}-question election quiz`}
      >
        Start Quiz
      </button>
    </div>
  );
}

/**
 * @param {{
 *   question: import('../data/electionContent.js').QuizQuestion,
 *   questionNumber: number,
 *   totalQuestions: number,
 *   selected: number|null,
 *   isRevealed: boolean,
 *   onSelect: (index: number) => void,
 *   onNext: () => void,
 * }} props
 */
function QuizQuestion({ question, questionNumber, totalQuestions, selected, isRevealed, onSelect, onNext }) {
  const isLast = questionNumber === totalQuestions;

  return (
    <div
      className="quiz-question-wrap"
      role="region"
      aria-label={`Question ${questionNumber} of ${totalQuestions}`}
    >
      {/* Progress */}
      <div className="quiz-progress-bar-wrap" aria-hidden="true">
        <div
          className="quiz-progress-bar-fill"
          style={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
        />
      </div>
      <p className="quiz-counter" aria-live="polite">
        Question {questionNumber} of {totalQuestions}
      </p>

      {/* Question */}
      <p className="quiz-question-text" id={`quiz-question-${question.id}`}>
        {question.question}
      </p>

      {/* Options */}
      <ul
        className="quiz-options"
        role="list"
        aria-labelledby={`quiz-question-${question.id}`}
      >
        {question.options.map((option, idx) => {
          let optClass = 'quiz-option';
          if (isRevealed) {
            if (idx === question.correctIndex) optClass += ' correct';
            else if (idx === selected) optClass += ' incorrect';
          } else if (idx === selected) {
            optClass += ' selected';
          }

          const ariaLabel = isRevealed
            ? `${option} — ${idx === question.correctIndex ? 'Correct answer' : idx === selected ? 'Your incorrect choice' : ''}`
            : option;

          return (
            <li key={idx} role="listitem">
              <button
                className={optClass}
                type="button"
                disabled={isRevealed}
                onClick={() => onSelect(idx)}
                aria-label={ariaLabel}
                aria-pressed={selected === idx}
              >
                <span className="quiz-option-letter" aria-hidden="true">
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Explanation (shown after answering) */}
      {isRevealed && (
        <div
          className={`quiz-explanation ${selected === question.correctIndex ? 'explanation-correct' : 'explanation-incorrect'}`}
          role="alert"
          aria-live="assertive"
        >
          <span className="explanation-icon" aria-hidden="true">
            {selected === question.correctIndex ? '✅' : '💡'}
          </span>
          <p>{question.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {isRevealed && (
        <button
          className="button primary quiz-next-btn"
          type="button"
          onClick={onNext}
          aria-label={isLast ? 'See your quiz results' : 'Go to next question'}
        >
          {isLast ? 'See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}

/**
 * @param {{
 *   answers: QuizState['answers'],
 *   onRetry: () => void,
 *   onAskAssistant: (question: string) => void,
 * }} props
 */
function QuizResults({ answers, onRetry, onAskAssistant }) {
  const score = answers.filter((a) => a.passed).length;
  const total = answers.length;
  const pct = Math.round((score / total) * 100);

  /** @type {{ emoji: string, title: string, message: string }} */
  const feedback = (() => {
    if (pct === 100) return { emoji: '🏆', title: 'Perfect Score!', message: 'You\'re an election expert. Share this knowledge with a friend!' };
    if (pct >= 75) return { emoji: '🌟', title: 'Great Job!', message: 'You know the election process well. Review any missed questions to sharpen up.' };
    if (pct >= 50) return { emoji: '📚', title: 'Good Start!', message: 'You have a solid foundation. Chat with the assistant to clarify the areas you missed.' };
    return { emoji: '🗺️', title: 'Keep Learning!', message: 'The assistant is here to help. Ask about any topic you found tricky.' };
  })();

  /** @type {string[]} */
  const missedTopics = [...new Set(
    answers
      .filter((a) => !a.passed)
      .map((a) => quizQuestions.find((q) => q.id === a.questionId)?.topic)
      .filter(Boolean)
  )];

  return (
    <div className="quiz-results" role="region" aria-label="Quiz results">
      <div className="results-emoji" aria-hidden="true">{feedback.emoji}</div>
      <h3 className="results-title">{feedback.title}</h3>
      <p className="results-score" aria-live="polite">
        You scored <strong>{score} out of {total}</strong> ({pct}%)
      </p>
      <p className="results-message">{feedback.message}</p>

      {/* Per-question breakdown */}
      <ol className="results-breakdown" aria-label="Question-by-question breakdown">
        {answers.map((answer, i) => {
          const q = quizQuestions.find((q) => q.id === answer.questionId);
          return (
            <li
              key={answer.questionId}
              className={`breakdown-item ${answer.passed ? 'breakdown-pass' : 'breakdown-fail'}`}
              aria-label={`Question ${i + 1}: ${answer.passed ? 'Correct' : 'Incorrect'}`}
            >
              <span className="breakdown-icon" aria-hidden="true">{answer.passed ? '✓' : '✗'}</span>
              <span className="breakdown-text">{q?.question}</span>
            </li>
          );
        })}
      </ol>

      <div className="results-actions">
        <button
          id="retryQuizButton"
          className="button primary"
          type="button"
          onClick={onRetry}
          aria-label="Retake the quiz from the beginning"
        >
          Try Again
        </button>
        {missedTopics.length > 0 && (
          <button
            className="button secondary"
            type="button"
            onClick={() => onAskAssistant(`Can you explain more about ${missedTopics[0]} in elections?`)}
            aria-label={`Ask the assistant about ${missedTopics[0]}`}
          >
            Ask About {missedTopics[0].charAt(0).toUpperCase() + missedTopics[0].slice(1)}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * ElectionQuiz – interactive 8-question knowledge quiz.
 *
 * @param {{ onAskAssistant?: (question: string) => void }} props
 *   `onAskAssistant` – optional callback to hand off a question to the AI chat.
 */
export default function ElectionQuiz({ onAskAssistant }) {
  const [state, dispatch] = useReducer(quizReducer, INITIAL_STATE);

  const handleStart   = useCallback(() => dispatch({ type: 'START' }), []);
  const handleSelect  = useCallback((idx) => dispatch({ type: 'SELECT', payload: idx }), []);
  const handleNext    = useCallback(() => dispatch({ type: 'NEXT' }), []);
  const handleRetry   = useCallback(() => dispatch({ type: 'RETRY' }), []);

  const currentQuestion = quizQuestions[state.currentIndex];

  return (
    <section
      className="quiz-container"
      aria-label="Election knowledge quiz"
      id="quiz"
    >
      {state.phase === 'intro' && <QuizIntro onStart={handleStart} />}

      {(state.phase === 'question' || state.phase === 'revealed') && currentQuestion && (
        <QuizQuestion
          question={currentQuestion}
          questionNumber={state.currentIndex + 1}
          totalQuestions={quizQuestions.length}
          selected={state.selected}
          isRevealed={state.phase === 'revealed'}
          onSelect={handleSelect}
          onNext={handleNext}
        />
      )}

      {state.phase === 'results' && (
        <QuizResults
          answers={state.answers}
          onRetry={handleRetry}
          onAskAssistant={onAskAssistant ?? (() => {})}
        />
      )}
    </section>
  );
}
