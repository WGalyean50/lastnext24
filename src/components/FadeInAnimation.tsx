import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const AnimatedContainer = styled.div<{
  animation: 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleIn';
  duration: number;
  delay: number;
  isVisible: boolean;
}>`
  opacity: ${props => props.isVisible ? 1 : 0};
  animation: ${props => {
    if (!props.isVisible) return 'none';
    
    switch (props.animation) {
      case 'slideInLeft': return slideInLeft;
      case 'slideInRight': return slideInRight;
      case 'scaleIn': return scaleIn;
      default: return fadeIn;
    }
  }} ${props => props.duration}ms ease-out ${props => props.delay}ms both;
`;

export interface FadeInAnimationProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleIn';
  duration?: number;
  delay?: number;
  trigger?: boolean;
  className?: string;
}

export const FadeInAnimation: React.FC<FadeInAnimationProps> = ({
  children,
  animation = 'fadeIn',
  duration = 400,
  delay = 0,
  trigger = true,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [trigger]);

  return (
    <AnimatedContainer
      animation={animation}
      duration={duration}
      delay={delay}
      isVisible={isVisible}
      className={className}
    >
      {children}
    </AnimatedContainer>
  );
};

export default FadeInAnimation;