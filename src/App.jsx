/**
 * App Root Component
 * Wraps the application with error handling and lazy-loading support.
 *
 * - ErrorBoundary: catches any unhandled React rendering errors and shows a
 *   graceful fallback instead of crashing the entire UI.
 * - Suspense: ready for lazy-loaded routes/components (future-proofing).
 */

import { Component, Suspense } from 'react';
import HomePage from './pages/HomePage.jsx';

/**
 * ErrorBoundary – catches unhandled React tree errors.
 * Class component required by the React error boundary API.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    /** @type {{ hasError: boolean, error: Error|null }} */
    this.state = { hasError: false, error: null };
  }

  /**
   * Invoked when a descendant throws. Updates state to trigger fallback UI.
   * @param {Error} error
   * @returns {{ hasError: boolean, error: Error }}
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Called after an error is caught; logs to console (could be sent to a
   * monitoring service in production).
   * @param {Error} error
   * @param {{ componentStack: string }} info
   */
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Unhandled rendering error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            fontFamily: 'sans-serif',
            maxWidth: '42rem',
            margin: '0 auto',
          }}
        >
          <h1 style={{ marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ color: '#58657a', marginBottom: '1.5rem' }}>
            The Election Guide Assistant encountered an unexpected error. Please refresh the page to
            try again.
          </p>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '999px',
              border: 'none',
              background: '#12325a',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Loading fallback shown while a lazy component is being fetched.
 * Accessible: uses role="status" so screen readers announce it.
 */
function LoadingFallback() {
  return (
    <div role="status" aria-live="polite" style={{ padding: '4rem', textAlign: 'center' }}>
      <span>Loading…</span>
    </div>
  );
}

/**
 * Root application component.
 * Renders the single-page election education experience.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <HomePage />
      </Suspense>
    </ErrorBoundary>
  );
}