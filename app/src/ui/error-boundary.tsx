import { Component, type ErrorInfo, type ReactNode } from 'react';
import { reportClientError } from '@/bootstrap/error-reporting';

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Rendered instead of children after an error. Receives the error and a reset callback. */
  fallback: (props: { error: Error; reset: () => void }) => ReactNode;
  /** Changing any of these values resets the boundary (e.g. the route path). */
  resetKeys?: unknown[];
  /** Extra context for the telemetry report. */
  context?: Record<string, unknown>;
}

interface State {
  error: Error | null;
  keys: unknown[] | undefined;
}

/** Catches render errors in its subtree, reports them to telemetry and renders `fallback`. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { error: null, keys: this.props.resetKeys };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  static getDerivedStateFromProps(props: ErrorBoundaryProps, state: State): Partial<State> | null {
    const a = props.resetKeys ?? [];
    const b = state.keys ?? [];
    if (state.error && (a.length !== b.length || a.some((v, i) => !Object.is(v, b[i])))) {
      return { error: null, keys: props.resetKeys };
    }
    if (props.resetKeys !== state.keys) return { keys: props.resetKeys };
    return null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportClientError(error, { source: 'react', componentStack: info.componentStack?.slice(0, 1500), ...this.props.context });
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) return this.props.fallback({ error: this.state.error, reset: this.reset });
    return this.props.children;
  }
}
