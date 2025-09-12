import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import type { UserRole } from '../types';

const RoleSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 3rem;
  text-align: center;
  opacity: 0.9;
`;

const RoleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 800px;
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
      
      <Title>Select Your Role</Title>
      <Subtitle>Choose a role to experience the demo from that perspective</Subtitle>
      
      <RoleGrid>
        {roles.map(({ role, title, description }) => (
          <RoleCard key={role} onClick={() => handleRoleSelect(role)}>
            <h3>{title}</h3>
            <p>{description}</p>
          </RoleCard>
        ))}
      </RoleGrid>
    </RoleSelectContainer>
  );
};

export default RoleSelectPage;