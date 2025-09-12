import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FadeInAnimation } from '../components';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Tagline = styled.h2`
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 3rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.125rem;
  }
`;

const DemoButton = styled(Link)`
  background: #3b82f6;
  color: white;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  display: inline-block;
  min-width: 200px;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }
  
  @media (max-width: 480px) {
    padding: 0.875rem 1.5rem;
    font-size: 1.1rem;
    min-width: 180px;
  }
`;

const HomePage: React.FC = () => {
  return (
    <HomeContainer>
      <FadeInAnimation animation="fadeIn" duration={600} delay={200}>
        <Title>LastNext24</Title>
      </FadeInAnimation>
      
      <FadeInAnimation animation="fadeIn" duration={600} delay={400}>
        <Tagline>Rapid Reporting Made Easy</Tagline>
      </FadeInAnimation>
      
      <FadeInAnimation animation="scaleIn" duration={500} delay={800}>
        <DemoButton to="/role-select">
          Enter Demo Version
        </DemoButton>
      </FadeInAnimation>
    </HomeContainer>
  );
};

export default HomePage;