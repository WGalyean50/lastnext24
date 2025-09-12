import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Tagline = styled.h2`
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 3rem;
  opacity: 0.9;
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

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }
`;

const HomePage: React.FC = () => {
  return (
    <HomeContainer>
      <Title>LastNext24</Title>
      <Tagline>Rapid Reporting Made Easy</Tagline>
      <DemoButton to="/role-select">
        Enter Demo Version
      </DemoButton>
    </HomeContainer>
  );
};

export default HomePage;