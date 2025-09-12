import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import type { User, UserRole, Report } from '../types';
import { getDirectReports, getTeamReports } from '../data';
import { reportAggregationService } from '../services';

interface ManagerViewProps {
  currentUserId: string;
  currentUserRole: UserRole;
  selectedDate: string;
  onGenerateReport?: (aggregatedContent: string) => void;
}

const ManagerContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ManagerHeader = styled.div`
  padding: 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ManagerTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
`;

const GenerateButton = styled.button<{ hasReports: boolean }>`
  background: ${props => props.hasReports ? '#3b82f6' : '#94a3b8'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: ${props => props.hasReports ? 'pointer' : 'not-allowed'};
  transition: background 0.2s;
  font-size: 0.875rem;

  &:hover {
    background: ${props => props.hasReports ? '#2563eb' : '#94a3b8'};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const TeamReportsSection = styled.div`
  padding: 1.5rem;
`;

const TeamMemberCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MemberHeader = styled.div<{ hasReport: boolean }>`
  padding: 1rem 1.5rem;
  background: ${props => props.hasReport ? '#f0f9ff' : '#f8fafc'};
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const MemberName = styled.span`
  font-weight: 500;
  color: #1e293b;
`;

const MemberRole = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  background: #e2e8f0;
  color: #64748b;
  font-weight: 500;
`;

const ReportStatus = styled.div<{ hasReport: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.hasReport ? '#16a34a' : '#dc2626'};
  font-weight: 500;
`;

const ReportContent = styled.div`
  padding: 1.5rem;
  background: white;
`;

const ReportText = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.6;
`;

const ReportMeta = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AggregatedReportSection = styled.div<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'block' : 'none'};
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const AggregatedHeader = styled.div`
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
`;

const AggregatedTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
`;

const EditButton = styled.button`
  background: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #3b82f6;
    color: white;
  }
`;

const SubmitButton = styled.button`
  background: #16a34a;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: background 0.2s;

  &:hover {
    background: #15803d;
  }
`;

const AggregatedContent = styled.div`
  padding: 1.5rem;
`;

const AggregatedTextArea = styled.textarea<{ isEditing: boolean }>`
  width: 100%;
  min-height: 200px;
  border: ${props => props.isEditing ? '2px solid #3b82f6' : '1px solid #e2e8f0'};
  border-radius: 6px;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
  resize: vertical;
  background: ${props => props.isEditing ? 'white' : '#f9fafb'};
  color: #374151;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
  }

  &[readonly] {
    cursor: default;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  padding: 3rem 1.5rem;
  text-align: center;
  color: #64748b;
  
  h4 {
    margin: 0 0 0.5rem 0;
    color: #374151;
  }
  
  p {
    margin: 0;
    font-size: 0.875rem;
  }
`;

export const ManagerView: React.FC<ManagerViewProps> = ({
  currentUserId,
  currentUserRole,
  selectedDate,
  onGenerateReport
}) => {
  const [aggregatedContent, setAggregatedContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAggregatedReport, setShowAggregatedReport] = useState(false);

  // Get team members and their reports
  const teamData = useMemo(() => {
    const directReports = getDirectReports(currentUserId);
    const teamReports = getTeamReports(currentUserId, selectedDate);
    
    return directReports.map(member => {
      const memberReports = teamReports.filter(report => report.user_id === member.id);
      const latestReport = memberReports[0]; // Reports are sorted by date desc
      
      return {
        member,
        report: latestReport || null,
        hasReport: !!latestReport
      };
    });
  }, [currentUserId, selectedDate]);

  const hasAnyReports = teamData.some(item => item.hasReport);

  const handleGenerateReport = async () => {
    if (!hasAnyReports) return;
    
    setIsGenerating(true);
    
    try {
      const reports = teamData
        .filter(item => item.hasReport && item.report)
        .map(item => item.report!);
      
      const teamMembers = teamData.map(item => item.member);
      
      // First try AI-powered aggregation, fallback to client-side
      const aggregationResult = await reportAggregationService.aggregateReportsWithAI({
        reports,
        teamMembers,
        managerRole: currentUserRole,
        date: selectedDate
      });
      
      setAggregatedContent(aggregationResult.aggregatedContent);
      setShowAggregatedReport(true);
      setIsGenerating(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error generating report:', error);
      
      // Fallback to simple client-side aggregation
      const reportsWithAuthors = teamData
        .filter(item => item.hasReport && item.report)
        .map(item => `**${item.member.name} (${item.member.role})**:\n${item.report!.content}`)
        .join('\n\n---\n\n');
      
      const summary = generateSimpleSummary(teamData.filter(item => item.hasReport));
      const aggregated = `${summary}\n\n## Team Reports Detail:\n\n${reportsWithAuthors}`;
      
      setAggregatedContent(aggregated);
      setShowAggregatedReport(true);
      setIsGenerating(false);
      setIsEditing(false);
    }
  };

  const generateSimpleSummary = (reportItems: Array<{ member: User; report: Report }>) => {
    const totalReports = reportItems.length;
    const teamSize = teamData.length;
    const reportingRate = Math.round((totalReports / teamSize) * 100);
    
    return `## Team Summary for ${new Date(selectedDate).toLocaleDateString()}

**Reporting Rate**: ${totalReports}/${teamSize} team members (${reportingRate}%)

**Key Highlights**:
- Team is actively working on multiple projects and initiatives
- Good progress being made across different work streams
- Regular communication and updates being provided

**Manager Notes**: This aggregated report combines insights from ${totalReports} team member reports for effective upward communication.`;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Could integrate with summarization API here in the future
  };

  const handleSubmit = () => {
    if (onGenerateReport) {
      onGenerateReport(aggregatedContent);
    }
    // This would typically save the aggregated report and submit it up the chain
    alert('Aggregated report submitted successfully!');
  };

  const getViewTitle = () => {
    switch (currentUserRole) {
      case 'Manager':
        return 'Team Reports';
      case 'Director':
        return 'Department Reports';
      case 'VP':
        return 'Division Reports';
      case 'CTO':
        return 'Organization Reports';
      default:
        return 'Reports';
    }
  };

  if (!['Manager', 'Director', 'VP', 'CTO'].includes(currentUserRole)) {
    return null; // Only show for management roles
  }

  return (
    <ManagerContainer>
      <ManagerHeader>
        <ManagerTitle>{getViewTitle()}</ManagerTitle>
        <GenerateButton
          hasReports={hasAnyReports}
          onClick={handleGenerateReport}
          disabled={!hasAnyReports || isGenerating}
        >
          {isGenerating ? (
            <>
              <LoadingSpinner /> Generating...
            </>
          ) : (
            'Generate Report'
          )}
        </GenerateButton>
      </ManagerHeader>

      <TeamReportsSection>
        {teamData.length > 0 ? (
          teamData.map(({ member, report, hasReport }) => (
            <TeamMemberCard key={member.id}>
              <MemberHeader hasReport={hasReport}>
                <MemberInfo>
                  <MemberName>{member.name}</MemberName>
                  <MemberRole>{member.role}</MemberRole>
                </MemberInfo>
                <ReportStatus hasReport={hasReport}>
                  {hasReport ? '✅ Reported' : '❌ No Report'}
                </ReportStatus>
              </MemberHeader>
              
              {hasReport && report && (
                <ReportContent>
                  <ReportText>{report.content}</ReportText>
                  <ReportMeta>
                    <span>Submitted: {new Date(report.created_at).toLocaleString()}</span>
                    {report.summary && <span>AI Summary Available</span>}
                  </ReportMeta>
                </ReportContent>
              )}
            </TeamMemberCard>
          ))
        ) : (
          <EmptyState>
            <h4>No Team Members</h4>
            <p>You don't have any direct reports assigned to your team.</p>
          </EmptyState>
        )}
      </TeamReportsSection>

      <AggregatedReportSection isVisible={showAggregatedReport}>
        <AggregatedHeader>
          <AggregatedTitle>Aggregated Team Report</AggregatedTitle>
          <div>
            <EditButton onClick={isEditing ? handleSave : handleEdit}>
              {isEditing ? 'Save' : 'Edit'}
            </EditButton>
            <SubmitButton onClick={handleSubmit}>
              Submit Report
            </SubmitButton>
          </div>
        </AggregatedHeader>
        
        <AggregatedContent>
          <AggregatedTextArea
            value={aggregatedContent}
            onChange={(e) => setAggregatedContent(e.target.value)}
            isEditing={isEditing}
            readOnly={!isEditing}
            placeholder="Aggregated team report will appear here..."
          />
        </AggregatedContent>
      </AggregatedReportSection>
    </ManagerContainer>
  );
};