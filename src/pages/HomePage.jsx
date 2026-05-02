/**
 * HomePage
 *
 * Root page of the Election Guide Assistant. Layout (top to bottom):
 * 1. Header / topbar
 * 2. Hero — headline + quick facts sidebar + demo scenario buttons
 * 3. Dashboard — AI chat panel + election timeline panel (side by side)
 * 4. Interactive tools — tabbed section containing:
 *    a. Process Tracker (6-step voter journey checklist)
 *    b. Election Quiz (8-question knowledge check)
 * 5. Feature cards — Before / During / After voting info
 * 6. Footer — disclaimer
 */

import { useCallback, useState } from 'react';

import AssistantPanel  from '../components/AssistantPanel.jsx';
import ElectionQuiz    from '../components/ElectionQuiz.jsx';
import ProcessTracker  from '../components/ProcessTracker.jsx';
import {
  demoScenarios,
  featureCards,
  quickFacts,
  timelineSteps,
} from '../data/electionContent.js';
import { useElectionAssistant } from '../hooks/useElectionAssistant.js';

/**
 * Tab identifiers for the interactive tools section.
 * @typedef {'tracker'|'quiz'} ToolTab
 */

/** Suggested prompt pills shown above the chat input. */
const PROMPT_BUTTONS = [
  { label: 'Registration', prompt: 'How do I register to vote?' },
  { label: 'Election Day',  prompt: 'What happens on Election Day?' },
  { label: 'Voting options', prompt: 'Can I vote by mail or early?' },
  { label: 'Counting',     prompt: 'How are votes counted?' },
];

export default function HomePage() {
  const assistant = useElectionAssistant();

  /** @type {[ToolTab, React.Dispatch<React.SetStateAction<ToolTab>>]} */
  const [activeTab, setActiveTab] = useState(/** @type {ToolTab} */ ('tracker'));

  /**
   * Scroll to the assistant panel and fire a question.
   * Used by the quiz "Ask About …" button so the two features integrate.
   * @type {(question: string) => void}
   */
  const handleQuizAsk = useCallback(
    (question) => {
      assistant.askAssistant(question);
      // Smooth-scroll the chat panel into view
      document.getElementById('assistant')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [assistant],
  );

  /** Tab order for keyboard navigation */
  const TAB_ORDER = /** @type {ToolTab[]} */ (['tracker', 'quiz']);

  /**
   * Handles Arrow/Home/End key navigation inside the tablist.
   * Implements the ARIA roving tabindex keyboard pattern.
   * @param {React.KeyboardEvent<HTMLButtonElement>} e
   */
  const handleTabKeyDown = useCallback(
    (e) => {
      const idx = TAB_ORDER.indexOf(activeTab);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveTab(TAB_ORDER[(idx + 1) % TAB_ORDER.length]);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveTab(TAB_ORDER[(idx - 1 + TAB_ORDER.length) % TAB_ORDER.length]);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setActiveTab(TAB_ORDER[0]);
      } else if (e.key === 'End') {
        e.preventDefault();
        setActiveTab(TAB_ORDER[TAB_ORDER.length - 1]);
      }
    },
    [activeTab, TAB_ORDER],
  );

  return (
    <div className="shell">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="topbar reveal" role="banner">
        <div className="brand" aria-label="Election Guide Assistant home">
          <div className="brand-mark" aria-hidden="true">E</div>
          <div>
            <div>Election Guide Assistant</div>
            <div className="tag">Interactive civic learning</div>
          </div>
        </div>
        <nav aria-label="Page sections">
          <div className="topbar-nav">
            <a className="topbar-link" href="#assistant">Chat</a>
            <a className="topbar-link" href="#timeline">Timeline</a>
            <a className="topbar-link" href="#tools">Tools</a>
          </div>
        </nav>
      </header>

      <main id="main">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="hero" aria-label="Introduction">
          <div className="hero-copy reveal delay-1">
            <div className="tag">Understand the process without jargon</div>
            <h1>Follow every election step with confidence.</h1>
            <p className="lede">
              This assistant explains how elections work, when important deadlines happen, and what
              to do before, during, and after voting — designed for first-time voters and everyone
              who wants a clearer picture.
            </p>

            {/* Hero stats */}
            <div className="hero-stats" aria-label="Quick statistics">
              <div className="hero-stat">
                <strong className="stat-number">6</strong>
                <span className="stat-label">Process steps</span>
              </div>
              <div className="hero-stat">
                <strong className="stat-number">8</strong>
                <span className="stat-label">Quiz questions</span>
              </div>
              <div className="hero-stat">
                <strong className="stat-number">AI</strong>
                <span className="stat-label">Powered chat</span>
              </div>
            </div>

            <div className="hero-actions">
              <a className="button primary" href="#assistant">Ask the assistant</a>
              <a className="button secondary" href="#tools">Try the tools</a>
            </div>
            <p className="microcopy">
              Election rules vary by location. Guidance uses a general U.S.-style election flow.
              Always verify deadlines with your official election office.
            </p>
          </div>

          {/* Hero aside — quick facts + demo scenarios */}
          <aside className="hero-aside reveal delay-2" aria-label="Quick facts">
            {quickFacts.map((fact) => (
              <div className="aside-card" key={fact.title}>
                <strong>{fact.title}</strong>
                <p className="aside-note">{fact.copy}</p>
              </div>
            ))}
            <div className="aside-card">
              <strong>Demo scenarios</strong>
              <p className="aside-note">Tap a scenario to see the assistant in action.</p>
              <div
                className="pill-row"
                style={{ marginTop: '0.85rem' }}
                role="group"
                aria-label="Demo scenarios"
              >
                {demoScenarios.map((scenario) => (
                  <button
                    key={scenario.title}
                    className="pill"
                    type="button"
                    aria-label={`Demo scenario: ${scenario.title}`}
                    onClick={() => assistant.askAssistant(scenario.prompt)}
                  >
                    {scenario.title}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </section>

        {/* ── Dashboard — Chat + Timeline ───────────────────────────── */}
        <section className="dashboard" aria-label="Election assistant and timeline">
          <AssistantPanel
            question={assistant.question}
            topic={assistant.topic}
            status={assistant.status}
            messages={assistant.messages}
            transcriptRef={assistant.transcriptRef}
            onQuestionChange={assistant.setQuestion}
            onTopicChange={assistant.setTopic}
            onAsk={() => assistant.askAssistant()}
            onClear={assistant.clearConversation}
            onPromptSelect={(prompt) => assistant.askAssistant(prompt)}
            prompts={PROMPT_BUTTONS}
            isLoading={assistant.isLoading}
          />

          <article
            className="panel reveal delay-3"
            id="timeline"
            aria-labelledby="timeline-title"
          >
            <div className="panel-head">
              <div>
                <h2 id="timeline-title">Election timeline</h2>
                <p>A simple path from preparation to certified results.</p>
              </div>
              <div className="tag">4-step overview</div>
            </div>

            <ol
              className="timeline"
              id="timelineList"
              aria-label="Election process steps"
            >
              {timelineSteps.map((step, index) => (
                <li
                  className="step"
                  key={step.title}
                  aria-label={`Step ${index + 1}: ${step.title}`}
                >
                  <div className="step-number" aria-hidden="true">{index + 1}</div>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </article>
        </section>

        {/* ── Interactive Tools — Tracker + Quiz ───────────────────── */}
        <section
          className="tools-section reveal"
          aria-label="Interactive learning tools"
          id="tools"
        >
          <div className="tools-header">
            <h2 id="tools-heading">Interactive Tools</h2>
            <p>Track your voter journey or test your election knowledge.</p>
          </div>

          {/* Tab bar */}
          <div
            className="tools-tabs"
            role="tablist"
            aria-label="Learning tool tabs"
          >
            <button
              id="tab-tracker"
              className={`tools-tab${activeTab === 'tracker' ? ' tools-tab--active' : ''}`}
              type="button"
              role="tab"
              aria-selected={activeTab === 'tracker'}
              aria-controls="panel-tracker"
              tabIndex={activeTab === 'tracker' ? 0 : -1}
              onClick={() => setActiveTab('tracker')}
              onKeyDown={handleTabKeyDown}
            >
              🗓️ Process Tracker
            </button>
            <button
              id="tab-quiz"
              className={`tools-tab${activeTab === 'quiz' ? ' tools-tab--active' : ''}`}
              type="button"
              role="tab"
              aria-selected={activeTab === 'quiz'}
              aria-controls="panel-quiz"
              tabIndex={activeTab === 'quiz' ? 0 : -1}
              onClick={() => setActiveTab('quiz')}
              onKeyDown={handleTabKeyDown}
            >
              🧠 Knowledge Quiz
            </button>
          </div>

          {/* Tab panels */}
          <div
            id="panel-tracker"
            role="tabpanel"
            aria-labelledby="tab-tracker"
            hidden={activeTab !== 'tracker'}
            className="tools-panel"
          >
            <ProcessTracker />
          </div>

          <div
            id="panel-quiz"
            role="tabpanel"
            aria-labelledby="tab-quiz"
            hidden={activeTab !== 'quiz'}
            className="tools-panel"
          >
            <ElectionQuiz onAskAssistant={handleQuizAsk} />
          </div>
        </section>

        {/* ── Feature Cards ─────────────────────────────────────────── */}
        <section
          className="grid-3"
          aria-label="Helpful voting stage details"
          id="featureGrid"
        >
          {featureCards.map((card) => (
            <article className="feature-card reveal" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </section>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <footer className="footer" role="contentinfo">
          <strong>Note:</strong> This is an educational assistant, not a legal authority. For
          exact deadlines or eligibility questions, use your official election office.
        </footer>
      </main>
    </div>
  );
}