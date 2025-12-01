/**
 * Error Boundary Components
 *
 * React error boundaries for graceful error handling.
 * Provides default fallback UI and optional error reporting.
 *
 * @module components/error-boundary
 */

'use client';

import { Component, type ReactNode } from 'react';

import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

/**
 * Props for the ErrorBoundary component
 */
interface ErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode;
  /** Custom fallback UI when an error occurs */
  fallback?: ReactNode;
  /** Callback for error reporting/logging */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Internal state for ErrorBoundary
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component for catching and handling React errors
 * Provides a fallback UI and optional error reporting
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console
    console.error('Error caught by boundary:', error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Return custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-red-500">오류가 발생했습니다</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                페이지를 표시하는 중 문제가 발생했습니다. 새로고침하거나 다시 시도해주세요.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error ? (
                <pre className="overflow-auto rounded-md bg-gray-100 p-4 text-xs dark:bg-gray-800">
                  {this.state.error.message}
                </pre>
              ) : null}
              <div className="flex gap-2">
                <Button onClick={this.handleReset}>다시 시도</Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  새로고침
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC to wrap a component with error boundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
): React.FC<P> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithErrorBoundary: React.FC<P> = (props) => {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return ComponentWithErrorBoundary;
}
