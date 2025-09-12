import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import type { UserRole } from '../types';
import { CreateReportModal, OrganizationTree, ManagerView, ChatInterface } from '../components';
import { reportStorage } from '../services';
import type { StoredReport } from '../services';
import { ORGANIZATION_USERS } from '../data';

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
  
  @media (max-width: 768px) {
    padding: 1rem 1rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.125rem;
    width: 100%;
    text-align: center;
    margin-bottom: 0.5rem;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: space-between;
    margin-left: 0;
  }
`;

const RoleIndicator = styled.div`
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
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
  white-space: nowrap;

  &:hover {
    background: #2563eb;
  }
  
  @media (max-width: 768px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }
  
  @media (max-width: 480px) {
    flex: 1;
    padding: 0.75rem 1rem;
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
  white-space: nowrap;

  &:hover {
    border-color: #94a3b8;
    color: #475569;
  }
  
  @media (max-width: 768px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
  
  @media (max-width: 480px) {
    flex: 1;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
  }
`;

const Sidebar = styled.aside`
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    width: 100%;
    order: 2;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    order: 1;
  }
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


const ReportsSection = styled.div`
  margin-top: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
`;

const ReportsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReportCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #3b82f6;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 6px;
  }
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
`;

const ReportTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const ReportDate = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  margin-left: auto;
  white-space: nowrap;
  
  @media (max-width: 480px) {
    margin-left: 0;
    font-size: 0.8rem;
  }
`;

const ReportContent = styled.p`
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
  margin: 0;
`;

const ReportMeta = styled.div`
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: #64748b;
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.7rem;
  }
`;

const AudioIndicator = styled.span`
  color: #3b82f6;
  font-weight: 500;
`;

const EmptyState = styled.div`
  background: white;
  border-radius: 8px;
  padding: 3rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #64748b;
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #374151;
  }
  
  p {
    margin: 0;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    
    h3 {
      font-size: 1.1rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    
    h3 {
      font-size: 1rem;
    }
    
    p {
      font-size: 0.9rem;
    }
  }
`;

const TimeFrameControls = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TimeFrameHeader = styled.div`
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #1e293b;
`;

const TimeFrameButtons = styled.div`
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const TimeFrameButton = styled.button<{ isActive: boolean }>`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: ${props => props.isActive ? '#3b82f6' : 'white'};
  color: ${props => props.isActive ? 'white' : '#374151'};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    color: ${props => props.isActive ? 'white' : '#3b82f6'};
  }
`;

const PreviousReportsCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const PreviousReportsHeader = styled.div`
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #1e293b;
`;

const PreviousReportsList = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const PreviousReportItem = styled.div`
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #f8fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const PreviousReportDate = styled.div`
  font-size: 0.75rem;
  color: #64748b;
`;

const PreviousReportContent = styled.div`
  font-size: 0.875rem;
  color: #374151;
  margin-top: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  });
  const [, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get role from session storage
    const storedRole = sessionStorage.getItem('selectedRole') as UserRole;
    if (storedRole) {
      setCurrentRole(storedRole);
      
      // Set a demo user ID based on role for demo purposes
      const demoUser = ORGANIZATION_USERS.find(user => user.role === storedRole);
      if (demoUser) {
        setCurrentUserId(demoUser.id);
      }
      
      // Load reports for current user
      loadUserReports();
    } else {
      // If no role selected, redirect to role selection
      navigate('/role-select');
    }
  }, [navigate]);

  const loadUserReports = () => {
    try {
      const userReports = reportStorage.getAllReportsForCurrentUser();
      setReports(userReports);
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
  };

  const handleChangeRole = () => {
    sessionStorage.removeItem('selectedRole');
    navigate('/role-select');
  };

  const handleNewReport = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitReport = async (reportData: {
    title?: string;
    content: string;
    date: string;
    audio_blob?: Blob;
    audio_duration?: number;
  }) => {
    try {
      const newReport = await reportStorage.createReport({
        title: reportData.title,
        content: reportData.content,
        date: reportData.date,
        audio_blob: reportData.audio_blob,
        audio_duration: reportData.audio_duration
      });
      
      console.log('Report created successfully:', newReport.id);
      
      // Reload reports to include the new one
      loadUserReports();
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create report:', error);
      alert('Failed to save report. Please try again.');
    }
  };

  const handleTimeFrameChange = (timeFrame: 'today' | 'yesterday') => {
    const today = new Date();
    if (timeFrame === 'yesterday') {
      today.setDate(today.getDate() - 1);
    }
    setSelectedDate(today.toISOString().split('T')[0]);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
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
      
      <ContentArea>
        <MainContent>
          <WelcomeCard>
            <WelcomeTitle>Welcome, {currentRole}!</WelcomeTitle>
            <WelcomeText>
              {getRoleDescription(currentRole)}
            </WelcomeText>
          </WelcomeCard>
          
          {/* Manager/Leadership View */}
          {['Manager', 'Director', 'VP', 'CTO'].includes(currentRole) && currentUserId && (
            <ManagerView
              currentUserId={currentUserId}
              currentUserRole={currentRole}
              selectedDate={selectedDate}
              onGenerateReport={(content) => {
                console.log('Generated report:', content);
              }}
            />
          )}

          <ReportsSection>
            <SectionTitle>Your Reports</SectionTitle>
            {reports.length > 0 ? (
              <ReportsList>
                {reports.map((report) => (
                  <ReportCard key={report.id}>
                    <ReportHeader>
                      <ReportTitle>
                        {report.title || `Report for ${new Date(report.date).toLocaleDateString()}`}
                      </ReportTitle>
                      <ReportDate>{new Date(report.date).toLocaleDateString()}</ReportDate>
                    </ReportHeader>
                    <ReportContent>
                      {report.content || 'No content provided'}
                    </ReportContent>
                    <ReportMeta>
                      <span>Created: {new Date(report.created_at).toLocaleString()}</span>
                      {report.has_audio && (
                        <AudioIndicator>🎤 Audio recorded</AudioIndicator>
                      )}
                    </ReportMeta>
                  </ReportCard>
                ))}
              </ReportsList>
            ) : (
              <EmptyState>
                <h3>No Reports Yet</h3>
                <p>Click the "New Report" button above to create your first report.</p>
              </EmptyState>
            )}
          </ReportsSection>
        </MainContent>

        <Sidebar>
          <TimeFrameControls>
            <TimeFrameHeader>Time Frame</TimeFrameHeader>
            <TimeFrameButtons>
              <TimeFrameButton
                isActive={selectedDate === new Date().toISOString().split('T')[0]}
                onClick={() => handleTimeFrameChange('today')}
              >
                Today
              </TimeFrameButton>
              <TimeFrameButton
                isActive={selectedDate === getYesterdayDate()}
                onClick={() => handleTimeFrameChange('yesterday')}
              >
                Yesterday
              </TimeFrameButton>
            </TimeFrameButtons>
          </TimeFrameControls>

          {/* Chat Interface for Leadership Roles */}
          {['Manager', 'Director', 'VP', 'CTO'].includes(currentRole) && (
            <ChatInterface
              currentUserId={currentUserId || undefined}
              currentUserRole={currentRole}
              selectedDate={selectedDate}
            />
          )}

          <OrganizationTree
            currentUserRole={currentRole}
            currentUserId={currentUserId || undefined}
            selectedDate={selectedDate}
            onUserSelect={handleUserSelect}
          />

          <PreviousReportsCard>
            <PreviousReportsHeader>Previous Reports</PreviousReportsHeader>
            <PreviousReportsList>
              {reports.slice(0, 5).map((report) => (
                <PreviousReportItem key={report.id}>
                  <PreviousReportDate>
                    {new Date(report.date).toLocaleDateString()}
                  </PreviousReportDate>
                  <PreviousReportContent>
                    {report.title || report.content || 'No content'}
                  </PreviousReportContent>
                </PreviousReportItem>
              ))}
              {reports.length === 0 && (
                <PreviousReportItem>
                  <PreviousReportContent style={{ color: '#64748b', fontStyle: 'italic' }}>
                    No reports yet
                  </PreviousReportContent>
                </PreviousReportItem>
              )}
            </PreviousReportsList>
          </PreviousReportsCard>
        </Sidebar>
      </ContentArea>

      <CreateReportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReport}
      />
    </DashboardContainer>
  );
};

export default DashboardPage;