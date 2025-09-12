import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import type { UserRole } from '../types';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 2rem;
  display: flex;
  justify-content: between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
`;

const RoleIndicator = styled.div`
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const NewReportButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const ChangeRoleButton = styled.button`
  background: transparent;
  color: #64748b;
  border: 1px solid #cbd5e1;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:hover {
    border-color: #94a3b8;
    color: #475569;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const WelcomeCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
`;

const WelcomeText = styled.p`
  color: #64748b;
  margin: 0;
  line-height: 1.6;
`;

const PlaceholderCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #64748b;
`;

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);

  useEffect(() => {
    // Get role from session storage
    const storedRole = sessionStorage.getItem('selectedRole') as UserRole;
    if (storedRole) {
      setCurrentRole(storedRole);
    } else {
      // If no role selected, redirect to role selection
      navigate('/role-select');
    }
  }, [navigate]);

  const handleChangeRole = () => {
    sessionStorage.removeItem('selectedRole');
    navigate('/role-select');
  };

  const handleNewReport = () => {
    // TODO: Open new report modal
    console.log('Opening new report modal...');
  };

  if (!currentRole) {
    return <div>Loading...</div>;
  }

  const getRoleDescription = (role: UserRole): string => {
    const descriptions = {
      Engineer: "Create and submit daily reports about your work progress.",
      Manager: "View your team's reports and create aggregated summaries for upper management.",
      Director: "Oversee multiple teams and coordinate strategic initiatives across departments.",
      VP: "Lead large divisions and coordinate cross-functional work at the executive level.",
      CTO: "Executive oversight with full organizational visibility and strategic decision-making."
    };
    return descriptions[role];
  };

  return (
    <DashboardContainer>
      <Header>
        <Logo>LastNext24</Logo>
        <HeaderActions>
          <NewReportButton onClick={handleNewReport}>
            + New Report
          </NewReportButton>
          <RoleIndicator>{currentRole}</RoleIndicator>
          <ChangeRoleButton onClick={handleChangeRole}>
            Change Role
          </ChangeRoleButton>
        </HeaderActions>
      </Header>
      
      <MainContent>
        <WelcomeCard>
          <WelcomeTitle>Welcome, {currentRole}!</WelcomeTitle>
          <WelcomeText>
            {getRoleDescription(currentRole)}
          </WelcomeText>
        </WelcomeCard>
        
        <PlaceholderCard>
          <h3>Dashboard Content Coming Soon</h3>
          <p>This is where the main application features will be implemented in subsequent phases.</p>
        </PlaceholderCard>
      </MainContent>
    </DashboardContainer>
  );
};

export default DashboardPage;