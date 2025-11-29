import { Component, ErrorInfo, ReactNode } from 'react';
import theme from '../styles/theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch JavaScript errors anywhere in child component tree.
 * Logs errors and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(_error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    // Note: _error is available for production error tracking services
    this.setState({ errorInfo });
    
    // In production, you would send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: sendToErrorTracking(_error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: theme.spacing.xl,
            backgroundColor: theme.colors.background,
            fontFamily: theme.typography.fontFamily
          }}
          role="alert"
          aria-live="assertive"
        >
          <div
            style={{
              backgroundColor: theme.colors.surface,
              padding: theme.spacing.xl,
              borderRadius: theme.borderRadius.large,
              boxShadow: theme.shadows.large,
              maxWidth: '500px',
              textAlign: 'center'
            }}
          >
            <h1
              style={{
                color: theme.colors.error,
                fontSize: theme.typography.fontSize.xlarge,
                marginBottom: theme.spacing.md
              }}
            >
              Oops! Something went wrong
            </h1>
            
            <p
              style={{
                color: theme.colors.text.secondary,
                fontSize: theme.typography.fontSize.medium,
                marginBottom: theme.spacing.lg
              }}
            >
              We're sorry for the inconvenience. Please try refreshing the page or click the button below to try again.
            </p>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details
                style={{
                  marginBottom: theme.spacing.lg,
                  textAlign: 'left',
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.background,
                  borderRadius: theme.borderRadius.small,
                  fontSize: theme.typography.fontSize.small
                }}
              >
                <summary
                  style={{
                    cursor: 'pointer',
                    color: theme.colors.text.secondary,
                    marginBottom: theme.spacing.sm
                  }}
                >
                  Error Details (Development Only)
                </summary>
                <pre
                  style={{
                    overflow: 'auto',
                    color: theme.colors.error,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div style={{ display: 'flex', gap: theme.spacing.md, justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.text.inverse,
                  border: 'none',
                  borderRadius: theme.borderRadius.small,
                  cursor: 'pointer',
                  fontSize: theme.typography.fontSize.medium,
                  fontWeight: theme.typography.fontWeight.medium
                }}
                aria-label="Try again"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                  backgroundColor: 'transparent',
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.small,
                  cursor: 'pointer',
                  fontSize: theme.typography.fontSize.medium
                }}
                aria-label="Refresh page"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
