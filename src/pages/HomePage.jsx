import AssistantPanel from '../components/AssistantPanel.jsx';
import { demoScenarios, featureCards, quickFacts, timelineSteps } from '../data/electionContent.js';
import { useElectionAssistant } from '../hooks/useElectionAssistant.js';

export default function HomePage() {
  const assistant = useElectionAssistant();

  const promptButtons = [
    { label: 'Registration', prompt: 'How do I register to vote?' },
    { label: 'Election Day', prompt: 'What happens on Election Day?' },
    { label: 'Voting options', prompt: 'Can I vote by mail or early?' },
    { label: 'Counting', prompt: 'How are votes counted?' },
  ];

  return (
    <div className="shell">
      <header className="topbar reveal" role="banner">
        <div className="brand" aria-label="Election Guide Assistant home">
          <div className="brand-mark" aria-hidden="true">
            E
          </div>
          <div>
            <div>Election Guide Assistant</div>
            <div className="tag">Interactive civic learning</div>
          </div>
        </div>
        <div className="tag" aria-label="Key features">Clear steps • Timeline • Accessible chat</div>
      </header>

      <main id="main">
        <section className="hero" aria-label="Introduction">
          <div className="hero-copy reveal delay-1">
            <div className="tag">Understand the process without jargon</div>
            <h1>Follow every election step with confidence.</h1>
            <p className="lede">
              This assistant explains how elections usually work, when the important deadlines happen, and what to do
              before, during, and after voting. It is designed to be easy to scan, keyboard friendly, and helpful for
              first-time voters.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#assistant">
                Ask the assistant
              </a>
              <a className="button secondary" href="#timeline">
                See the timeline
              </a>
            </div>
            <p className="microcopy">
              Election rules vary by location. The guidance below uses a general U.S.-style election flow and reminds
              users to verify local deadlines with their official election office.
            </p>
          </div>

          <aside className="hero-aside reveal delay-2" aria-label="Quick facts">
            {quickFacts.map((fact) => (
              <div className="aside-card" key={fact.title}>
                <strong>{fact.title}</strong>
                <p className="aside-note">{fact.copy}</p>
              </div>
            ))}

            <div className="aside-card">
              <strong>Demo scenarios</strong>
              <p className="aside-note">Use these to show the product adapts to a real voter situation.</p>
              <div className="pill-row" style={{ marginTop: '0.85rem' }} role="group" aria-label="Demo scenarios">
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
            prompts={promptButtons}
            isLoading={assistant.isLoading}
          />

          <article className="panel reveal delay-3" id="timeline" aria-labelledby="timeline-title">
            <div className="panel-head">
              <div>
                <h2 id="timeline-title">Election timeline</h2>
                <p>A simple path from preparation to certified results.</p>
              </div>
              <div className="tag">4-step overview</div>
            </div>

            <ol className="timeline" id="timelineList" aria-label="Election process steps">
              {timelineSteps.map((step, index) => (
                <li className="step" key={step.title} aria-label={`Step ${index + 1}: ${step.title}`}>
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

        <section className="grid-3" aria-label="Helpful details" id="featureGrid">
          {featureCards.map((card) => (
            <article className="feature-card reveal" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </section>

        <footer className="footer" role="contentinfo">
          <strong>Note:</strong> This is an educational assistant, not a legal authority. For exact deadlines or
          eligibility questions, use your official election office.
        </footer>
      </main>
    </div>
  );
}