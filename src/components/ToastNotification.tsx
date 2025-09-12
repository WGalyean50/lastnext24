import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOutRight = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div<{
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  isExiting: boolean;
}>`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1070;
  min-width: 300px;
  max-width: 400px;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  animation: ${props => props.isExiting ? slideOutRight : slideInRight} 300ms ease-out forwards;
  
  ${props => {
    switch (props.type) {
      case 'success':
        return `
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
        `;
      case 'error':
        return `
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
        `;
      case 'warning':
        return `
          background: #fffbeb;
          border: 1px solid #fed7aa;
          color: #92400e;
        `;
      default: // info
        return `
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1e40af;
        `;
    }
  }}
  
  @media (max-width: ${theme.breakpoints.sm}) {
    top: 0.5rem;
    right: 0.5rem;
    left: 0.5rem;
    min-width: auto;
    max-width: none;
  }
`;

const IconContainer = styled.div<{ type: 'success' | 'error' | 'warning' | 'info' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  
  ${props => {
    switch (props.type) {
      case 'success':
        return `background: #22c55e; color: white;`;
      case 'error':
        return `background: #ef4444; color: white;`;
      case 'warning':
        return `background: #f59e0b; color: white;`;
      default:
        return `background: #3b82f6; color: white;`;
    }
  }}
`;

const Content = styled.div`
  flex: 1;
  font-size: ${theme.typography.fontSize.sm};
  line-height: ${theme.typography.lineHeight.normal};
`;

const Title = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing.xs};
`;

const Message = styled.div`
  opacity: 0.9;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: currentColor;
  opacity: 0.7;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: opacity ${theme.transitions.fast};
  
  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.1);
  }
`;

export interface ToastNotificationProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '!';
      default:
        return 'i';
    }
  };

  if (!isVisible) return null;

  return (
    <ToastContainer type={type} isVisible={isVisible} isExiting={isExiting}>
      <IconContainer type={type}>
        {getIcon()}
      </IconContainer>
      <Content>
        {title && <Title>{title}</Title>}
        <Message>{message}</Message>
      </Content>
      <CloseButton onClick={handleClose}>
        ×
      </CloseButton>
    </ToastContainer>
  );
};

// Toast manager hook
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<ToastNotificationProps & { id: string }>>([]);

  const addToast = (toast: ToastNotificationProps) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message: string, title?: string) => {
    addToast({ type: 'success', title, message });
  };

  const showError = (message: string, title?: string) => {
    addToast({ type: 'error', title, message });
  };

  const showWarning = (message: string, title?: string) => {
    addToast({ type: 'warning', title, message });
  };

  const showInfo = (message: string, title?: string) => {
    addToast({ type: 'info', title, message });
  };

  return {
    toasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast
  };
};

export default ToastNotification;