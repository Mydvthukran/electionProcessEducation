/**
 * AssistantPanel Component
 * Main chat interface for the election assistant
 * 
 * Displays:
 * - Assistant introduction
 * - Suggested prompts (quick access buttons)
 * - Question input field
 * - Topic selector dropdown
 * - Message transcript (conversation history)
 * - Loading state during API calls
 */

import MessageTranscript from './MessageTranscript.jsx';

export default function AssistantPanel({
  question,
  topic,
  status,
  messages,
  transcriptRef,
  onQuestionChange,
  onTopicChange,
  onAsk,
  onClear,
  onPromptSelect,
  prompts,
  isLoading = false,
}) {
  return (
    <article className="panel assistant-window reveal delay-2" id="assistant" aria-labelledby="assistant-title">
      <div className="panel-head">
        <div>
          <h2 id="assistant-title">Ask a question</h2>
          <p>Try a topic, pick a guided demo scenario, or type your own question.</p>
        </div>
        <div className="tag" aria-live="polite" id="status">
          {isLoading ? '⏳ Thinking...' : status}
        </div>
      </div>

      <div className="pill-row" aria-label="Suggested prompts">
        {prompts.map((prompt) => (
          <button
            key={prompt.label}
            className="pill"
            type="button"
            disabled={isLoading}
            onClick={() => onPromptSelect(prompt.prompt)}
            aria-label={`Suggested prompt: ${prompt.label}`}
          >
            {prompt.label}
          </button>
        ))}
      </div>

      <div className="controls" role="search">
        <div className="input-group">
          <label htmlFor="question">Your question</label>
          <input
            className="text-input"
            id="question"
            name="question"
            type="text"
            inputMode="text"
            autoComplete="off"
            placeholder="Example: When should I check my registration?"
            value={question}
            disabled={isLoading}
            onChange={(event) => onQuestionChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !isLoading) {
                event.preventDefault();
                onAsk();
              }
            }}
            aria-describedby="status"
          />
        </div>

        <div className="input-group" style={{ alignSelf: 'end' }}>
          <label className="sr-only" htmlFor="topic">
            Topic
          </label>
          <select
            className="select"
            id="topic"
            name="topic"
            value={topic}
            disabled={isLoading}
            onChange={(event) => onTopicChange(event.target.value)}
            aria-label="Filter by topic"
          >
            <option value="general">General</option>
            <option value="registration">Registration</option>
            <option value="timeline">Timeline</option>
            <option value="ballot">Ballot</option>
            <option value="counting">Counting</option>
          </select>
        </div>
      </div>

      <div className="hero-actions" style={{ marginTop: 0 }}>
        <button
          className="button primary"
          type="button"
          disabled={isLoading}
          onClick={onAsk}
          aria-label="Ask the assistant a question"
        >
          {isLoading ? 'Thinking...' : 'Ask assistant'}
        </button>
        <button
          className="button secondary"
          type="button"
          disabled={isLoading}
          onClick={onClear}
          aria-label="Clear the conversation"
        >
          Clear chat
        </button>
      </div>

      <MessageTranscript messages={messages} transcriptRef={transcriptRef} />
    </article>
  );
}