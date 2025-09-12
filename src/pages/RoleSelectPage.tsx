import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import type { UserRole } from '../types';
import { FadeInAnimation } from '../components';

const RoleSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 20px 15px;
    justify-content: flex-start;
    padding-top: 60px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 3rem;
  text-align: center;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const RoleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 800px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    max-width: 500px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    max-width: 300px;
  }
`;

const RoleCard = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 2rem 1.5rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.3rem;
  }

  p {
    margin: 0;
    opacity: 0.8;
    font-size: 0.9rem;
    font-weight: 400;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    
    h3 {
      font-size: 1.2rem;
    }
    
    p {
      font-size: 0.85rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 1.25rem 1rem;
    font-size: 1rem;
    
    h3 {
      font-size: 1.1rem;
    }
    
    p {
      font-size: 0.8rem;
    }
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    top: 1rem;
    left: 1rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }
`;

const roles: Array<{role: UserRole, title: string, description: string}> = [
  { role: 'Engineer', title: 'Engineer', description: 'Individual contributor creating daily reports' },
  { role: 'Manager', title: 'Manager', description: 'Manage team reports and create aggregated updates' },
  { role: 'Director', title: 'Director', description: 'Oversee multiple teams and strategic initiatives' },
  { role: 'VP', title: 'VP', description: 'Lead large divisions and coordinate cross-functional work' },
  { role: 'CTO', title: 'CTO', description: 'Executive oversight with full organizational visibility' },
];

const RoleSelectPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    // Store selected role in session storage
    sessionStorage.setItem('selectedRole', role);
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <RoleSelectContainer>
      <BackButton onClick={handleBack}>
        ← Back to Home
      </BackButton>
      
      <FadeInAnimation animation="slideInLeft" duration={500} delay={100}>
        <Title>Select Your Role</Title>
      </FadeInAnimation>
      
      <FadeInAnimation animation="slideInLeft" duration={500} delay={300}>
        <Subtitle>Choose a role to experience the demo from that perspective</Subtitle>
      </FadeInAnimation>
      
      <RoleGrid>
        {roles.map(({ role, title, description }, index) => (
          <FadeInAnimation 
            key={role} 
            animation="scaleIn" 
            duration={400} 
            delay={500 + (index * 100)}
          >
            <RoleCard onClick={() => handleRoleSelect(role)}>
              <h3>{title}</h3>
              <p>{description}</p>
            </RoleCard>
          </FadeInAnimation>
        ))}
      </RoleGrid>
    </RoleSelectContainer>
  );
};

export default RoleSelectPage;