import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { AnimatedButton } from './AnimatedButton';

const ErrorContainer = styled.div`
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing['2xl']};
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.base};
  margin: ${theme.spacing.lg};
  text-align: center;
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${theme.colors.gray[100]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: ${theme.colors.error};
  margin-bottom: ${theme.spacing.lg};
`;

const ErrorTitle = styled.h2`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.gray[800]};
  margin: 0 0 ${theme.spacing.md} 0;
`;

const ErrorMessage = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.gray[600]};
  line-height: ${theme.typography.lineHeight.relaxed};
  margin: 0 0 ${theme.spacing.lg} 0;
  max-width: 500px;
`;

const ErrorDetails = styled.details`
  margin: ${theme.spacing.lg} 0;
  padding: ${theme.spacing.md};
  background: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.gray[200]};
  width: 100%;
  max-width: 600px;
  
  summary {
    cursor: pointer;
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.gray[700]};
    margin-bottom: ${theme.spacing.sm};
  }
  
  pre {
    background: ${theme.colors.gray[100]};
    padding: ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.sm};
    font-size: ${theme.typography.fontSize.sm};
    overflow-x: auto;
    margin: ${theme.spacing.sm} 0 0 0;
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
  margin-top: ${theme.spacing.lg};
`;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Call optional error callback
    this.props.onError?.(error, errorInfo);

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you might want to log to an error reporting service
    // like Sentry, LogRocket, etc.
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo } = this.state;

      return (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          
          <ErrorTitle>Oops! Something went wrong</ErrorTitle>
          
          <ErrorMessage>
            We're sorry, but something unexpected happened. Please try refreshing the page or go back to the homepage.
          </ErrorMessage>

          <ButtonGroup>
            <AnimatedButton variant="primary" onClick={this.handleRetry}>
              Try Again
            </AnimatedButton>
            
            <AnimatedButton variant="secondary" onClick={this.handleReload}>
              Refresh Page
            </AnimatedButton>
            
            <AnimatedButton variant="ghost" onClick={this.handleGoHome}>
              Go Home
            </AnimatedButton>
          </ButtonGroup>

          {process.env.NODE_ENV === 'development' && error && (
            <ErrorDetails>
              <summary>Error Details (Development)</summary>
              <div>
                <strong>Error:</strong> {error.message}
                <pre>{error.stack}</pre>
              </div>
              {errorInfo && (
                <div>
                  <strong>Component Stack:</strong>
                  <pre>{errorInfo.componentStack}</pre>
                </div>
              )}
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to handle errors
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: any) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // You can dispatch to a global error state here
    // or show a toast notification
    
    // For now, we'll just throw it to be caught by ErrorBoundary
    throw error;
  };
};

export default ErrorBoundary;