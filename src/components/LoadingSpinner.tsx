import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const SpinnerContainer = styled.div<{ size: 'sm' | 'md' | 'lg' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => {
    switch (props.size) {
      case 'sm': return '16px';
      case 'lg': return '40px';
      default: return '24px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'sm': return '16px';
      case 'lg': return '40px';
      default: return '24px';
    }
  }};
`;

const Spinner = styled.div<{ size: 'sm' | 'md' | 'lg'; color?: string }>`
  width: 100%;
  height: 100%;
  border: 2px solid ${theme.colors.gray[200]};
  border-top: 2px solid ${props => props.color || theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const DotsContainer = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const Dot = styled.div<{ delay: number; color?: string }>`
  width: 8px;
  height: 8px;
  background-color: ${props => props.color || theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${bounce} 1.4s ease-in-out infinite both;
  animation-delay: ${props => props.delay}s;
`;

const PulseContainer = styled.div<{ size: 'sm' | 'md' | 'lg' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => {
    switch (props.size) {
      case 'sm': return '20px';
      case 'lg': return '60px';
      default: return '40px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'sm': return '20px';
      case 'lg': return '60px';
      default: return '40px';
    }
  }};
`;

const PulseCircle = styled.div<{ color?: string }>`
  width: 100%;
  height: 100%;
  background-color: ${props => props.color || theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const LoadingText = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  color: ${theme.colors.gray[600]};
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return theme.typography.fontSize.sm;
      case 'lg': return theme.typography.fontSize.lg;
      default: return theme.typography.fontSize.base;
    }
  }};
  margin-left: ${theme.spacing.sm};
  animation: ${pulse} 2s ease-in-out infinite;
`;

const FullPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: ${theme.spacing.lg};
`;

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color,
  text,
  variant = 'spinner',
  fullPage = false
}) => {
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <DotsContainer>
            <Dot delay={0} color={color} />
            <Dot delay={0.2} color={color} />
            <Dot delay={0.4} color={color} />
          </DotsContainer>
        );
      case 'pulse':
        return (
          <PulseContainer size={size}>
            <PulseCircle color={color} />
          </PulseContainer>
        );
      default:
        return (
          <SpinnerContainer size={size}>
            <Spinner size={size} color={color} />
          </SpinnerContainer>
        );
    }
  };

  const content = (
    <>
      {renderSpinner()}
      {text && <LoadingText size={size}>{text}</LoadingText>}
    </>
  );

  if (fullPage) {
    return (
      <FullPageContainer>
        {content}
      </FullPageContainer>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {content}
    </div>
  );
};

export default LoadingSpinner;