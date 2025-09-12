import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { LoadingSpinner } from './LoadingSpinner';

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

const ButtonContainer = styled.button<{
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  overflow: hidden;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-family: inherit;
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all ${theme.transitions.base};
  text-decoration: none;
  
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  /* Size variants */
  ${props => {
    switch (props.size) {
      case 'sm':
        return `
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: ${theme.typography.fontSize.sm};
          min-height: 32px;
        `;
      case 'lg':
        return `
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: ${theme.typography.fontSize.lg};
          min-height: 48px;
        `;
      default:
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.base};
          min-height: 40px;
        `;
    }
  }}
  
  /* Color variants */
  ${props => {
    if (props.disabled) {
      return `
        background: ${theme.colors.gray[200]};
        color: ${theme.colors.gray[400]};
        box-shadow: none;
      `;
    }
    
    switch (props.variant) {
      case 'secondary':
        return `
          background: ${theme.colors.white};
          color: ${theme.colors.gray[700]};
          border: 1px solid ${theme.colors.gray[300]};
          
          &:hover:not(:disabled) {
            border-color: ${theme.colors.primary[500]};
            color: ${theme.colors.primary[600]};
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.primary[600]};
          border: 1px solid transparent;
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary[50]};
            color: ${theme.colors.primary[700]};
          }
          
          &:active:not(:disabled) {
            background: ${theme.colors.primary[100]};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error};
          color: ${theme.colors.white};
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          
          &:hover:not(:disabled) {
            background: #dc2626;
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
          }
        `;
      default: // primary
        return `
          background: ${theme.colors.primary[500]};
          color: ${theme.colors.white};
          box-shadow: ${theme.shadows.blue};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary[600]};
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
          }
        `;
    }
  }}
  
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;

const RippleEffect = styled.span`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  animation: ${ripple} 600ms ease-out;
  pointer-events: none;
`;

const IconContainer = styled.span<{ position: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  order: ${props => props.position === 'left' ? 0 : 2};
`;

export interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  onClick,
  children,
  ...rest
}) => {
  const [ripples, setRipples] = useState<Array<{id: number; x: number; y: number; size: number}>>([]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Create ripple effect
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const size = Math.max(rect.width, rect.height);

    const newRipple = {
      id: Date.now(),
      x: x - size / 2,
      y: y - size / 2,
      size
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    onClick?.(event);
  };

  return (
    <ButtonContainer
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={handleClick}
      {...rest}
    >
      {ripples.map(ripple => (
        <RippleEffect
          key={ripple.id}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
      
      {leftIcon && !loading && (
        <IconContainer position="left">
          {leftIcon}
        </IconContainer>
      )}
      
      {loading && (
        <LoadingSpinner 
          size="sm" 
          color={variant === 'primary' || variant === 'danger' ? 'white' : theme.colors.primary[500]}
        />
      )}
      
      {children}
      
      {rightIcon && !loading && (
        <IconContainer position="right">
          {rightIcon}
        </IconContainer>
      )}
    </ButtonContainer>
  );
};

export default AnimatedButton;