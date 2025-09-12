import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { AnimatedButton } from './AnimatedButton';

const ErrorContainer = styled.div<{ size: 'sm' | 'md' | 'lg' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${props => {
    switch (props.size) {
      case 'sm': return `${theme.spacing.lg} ${theme.spacing.md}`;
      case 'lg': return `${theme.spacing['3xl']} ${theme.spacing.xl}`;
      default: return `${theme.spacing['2xl']} ${theme.spacing.lg}`;
    }
  }};
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.gray[200]};
`;

const ErrorIcon = styled.div<{ variant: 'error' | 'warning' | 'info'; size: 'sm' | 'md' | 'lg' }>`
  width: ${props => {
    switch (props.size) {
      case 'sm': return '40px';
      case 'lg': return '80px';
      default: return '60px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'sm': return '40px';
      case 'lg': return '80px';
      default: return '60px';
    }
  }};
  background: ${props => {
    switch (props.variant) {
      case 'error': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      default: return theme.colors.info;
    }
  }};
  color: ${theme.colors.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '1.25rem';
      case 'lg': return '2rem';
      default: return '1.5rem';
    }
  }};
  margin-bottom: ${theme.spacing.md};
`;

const ErrorTitle = styled.h3<{ size: 'sm' | 'md' | 'lg' }>`
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return theme.typography.fontSize.lg;
      case 'lg': return theme.typography.fontSize['2xl'];
      default: return theme.typography.fontSize.xl;
    }
  }};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray[800]};
  margin: 0 0 ${theme.spacing.sm} 0;
`;

const ErrorMessage = styled.p<{ size: 'sm' | 'md' | 'lg' }>`
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return theme.typography.fontSize.sm;
      case 'lg': return theme.typography.fontSize.lg;
      default: return theme.typography.fontSize.base;
    }
  }};
  color: ${theme.colors.gray[600]};
  line-height: ${theme.typography.lineHeight.relaxed};
  margin: 0 0 ${theme.spacing.lg} 0;
  max-width: ${props => {
    switch (props.size) {
      case 'sm': return '300px';
      case 'lg': return '600px';
      default: return '400px';
    }
  }};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: center;
`;

export interface ErrorStateProps {
  variant?: 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHome?: boolean;
  onRetry?: () => void;
  onHome?: () => void;
  customActions?: React.ReactNode;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  variant = 'error',
  size = 'md',
  title,
  message,
  showRetry = false,
  showHome = false,
  onRetry,
  onHome,
  customActions,
  className
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'error': return '✕';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getDefaultTitle = () => {
    switch (variant) {
      case 'error': return 'Something went wrong';
      case 'warning': return 'Warning';
      default: return 'Information';
    }
  };

  const getDefaultMessage = () => {
    switch (variant) {
      case 'error': return 'An error occurred while processing your request. Please try again.';
      case 'warning': return 'Please review the information and try again.';
      default: return 'Here is some additional information.';
    }
  };

  return (
    <ErrorContainer size={size} className={className}>
      <ErrorIcon variant={variant} size={size}>
        {getIcon()}
      </ErrorIcon>
      
      <ErrorTitle size={size}>
        {title || getDefaultTitle()}
      </ErrorTitle>
      
      <ErrorMessage size={size}>
        {message || getDefaultMessage()}
      </ErrorMessage>

      {(showRetry || showHome || customActions) && (
        <ButtonContainer>
          {showRetry && onRetry && (
            <AnimatedButton 
              variant="primary" 
              size={size === 'sm' ? 'sm' : 'md'}
              onClick={onRetry}
            >
              Try Again
            </AnimatedButton>
          )}
          
          {showHome && onHome && (
            <AnimatedButton 
              variant="secondary" 
              size={size === 'sm' ? 'sm' : 'md'}
              onClick={onHome}
            >
              Go Home
            </AnimatedButton>
          )}
          
          {customActions}
        </ButtonContainer>
      )}
    </ErrorContainer>
  );
};

// Common error state presets
export const NetworkError: React.FC<Omit<ErrorStateProps, 'variant' | 'title' | 'message'>> = (props) => (
  <ErrorState
    variant="error"
    title="Network Error"
    message="Unable to connect to the server. Please check your internet connection and try again."
    {...props}
  />
);

export const NotFoundError: React.FC<Omit<ErrorStateProps, 'variant' | 'title' | 'message'>> = (props) => (
  <ErrorState
    variant="warning"
    title="Not Found"
    message="The requested resource could not be found."
    {...props}
  />
);

export const UnauthorizedError: React.FC<Omit<ErrorStateProps, 'variant' | 'title' | 'message'>> = (props) => (
  <ErrorState
    variant="warning"
    title="Access Denied"
    message="You don't have permission to access this resource."
    {...props}
  />
);

export const ServerError: React.FC<Omit<ErrorStateProps, 'variant' | 'title' | 'message'>> = (props) => (
  <ErrorState
    variant="error"
    title="Server Error"
    message="The server encountered an error while processing your request. Please try again later."
    {...props}
  />
);

export default ErrorState;