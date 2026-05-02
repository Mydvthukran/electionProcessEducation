/**
 * MessageTranscript Component
 * Displays conversation history between user and assistant
 * 
 * Features:
 * - Role-based styling (user vs. assistant messages)
 * - Structured answer rendering (summary, steps, next action)
 * - Auto-scroll support (via ref)
 * - Accessibility support (ARIA live region)
 * - Source attribution (shows if response came from Gemini AI or local)
 */

export default function MessageTranscript({ messages, transcriptRef }) {
  return (
    <div className="transcript" ref={transcriptRef} aria-live="polite" aria-relevant="additions text">
      {messages.map((message) => {
        const isAssistant = message.role === 'assistant';
        const sourceLabel = message.source ? `[${message.source.toUpperCase()}]` : '';

        return (
          <article key={message.id} className="message" data-role={message.role}>
            <div className="meta">{message.title}</div>

            <div className="bubble">
              {message.type === 'answer' && isAssistant ? (
                <>
                  <p>
                    <strong>Short answer:</strong> {message.summary}
                  </p>
                  <p>
                    <strong>What to remember:</strong>
                  </p>
                  <ol>
                    {message.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <p>
                    <strong>Next step:</strong> {message.next}
                  </p>
                  <p className="meta">
                    Topic: {message.topic} | {sourceLabel}
                  </p>
                </>
              ) : message.type === 'error' ? (
                <p style={{ color: 'var(--error, #c00)' }}>{message.text}</p>
              ) : (
                <p>{message.text}</p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}