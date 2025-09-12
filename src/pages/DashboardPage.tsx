import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import type { UserRole } from '../types';
import { CreateReportModal } from '../components';
import { reportStorage } from '../services';
import type { StoredReport } from '../services';

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
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
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
`;

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  useEffect(() => {
    // Get role from session storage
    const storedRole = sessionStorage.getItem('selectedRole') as UserRole;
    if (storedRole) {
      setCurrentRole(storedRole);
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
      setIsSubmittingReport(true);
      
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
    } finally {
      setIsSubmittingReport(false);
    }
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

      <CreateReportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReport}
      />
    </DashboardContainer>
  );
};

export default DashboardPage;