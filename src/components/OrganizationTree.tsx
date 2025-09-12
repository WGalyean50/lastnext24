import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import type { User, UserRole, Report } from '../types';
import { ORGANIZATION_USERS, getUserById, getDirectReports, getReportsByUser } from '../data';

interface TreeNode extends User {
  children: TreeNode[];
  reports?: Report[];
  level: number;
}

interface OrganizationTreeProps {
  currentUserRole: UserRole;
  currentUserId?: string;
  selectedDate: string;
  onUserSelect?: (userId: string) => void;
}

const TreeContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TreeHeader = styled.div`
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #1e293b;
`;

const TreeContent = styled.div`
  padding: 1rem;
  max-height: 600px;
  overflow-y: auto;
`;

const TreeItem = styled.div<{ level: number; isExpanded?: boolean; hasChildren?: boolean }>`
  margin-left: ${props => props.level * 20}px;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const NodeContainer = styled.div<{ isSelected?: boolean; hasReports?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${props => props.hasReports ? '#3b82f6' : 'transparent'};
  background: ${props => {
    if (props.isSelected) return '#eff6ff';
    if (props.hasReports) return '#f0f9ff';
    return 'transparent';
  }};

  &:hover {
    background: ${props => props.isSelected ? '#dbeafe' : '#f1f5f9'};
  }
`;

const ExpandButton = styled.button<{ isExpanded: boolean; hasChildren: boolean }>`
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  color: #64748b;
  font-size: 12px;
  opacity: ${props => props.hasChildren ? 1 : 0};
  pointer-events: ${props => props.hasChildren ? 'auto' : 'none'};
  
  &:hover {
    color: #3b82f6;
  }
  
  &::after {
    content: '${props => props.isExpanded ? '▼' : '▶'}';
    transition: transform 0.2s;
  }
`;

const UserInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #1e293b;
`;

const UserRole = styled.span<{ role: UserRole }>`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
  color: white;
  background: ${props => {
    switch (props.role) {
      case 'CTO': return '#dc2626';
      case 'VP': return '#ea580c';
      case 'Director': return '#ca8a04';
      case 'Manager': return '#16a34a';
      case 'Engineer': return '#2563eb';
      default: return '#64748b';
    }
  }};
`;

const ReportIndicator = styled.div<{ count: number }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: ${props => props.count > 0 ? '#3b82f6' : '#94a3b8'};
  font-weight: 500;
`;

const ReportContent = styled.div<{ isVisible: boolean }>`
  margin-top: 0.75rem;
  margin-left: 2rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
  display: ${props => props.isVisible ? 'block' : 'none'};
`;

const ReportText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ReportDate = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.5rem;
`;

export const OrganizationTree: React.FC<OrganizationTreeProps> = ({
  currentUserRole,
  currentUserId,
  selectedDate,
  onUserSelect
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Build the tree structure based on role-based visibility rules
  const tree = useMemo(() => {
    const buildTree = (managerId?: string, level: number = 0): TreeNode[] => {
      const directReports = getDirectReports(managerId || '');
      
      return directReports.map(user => {
        const children = buildTree(user.id, level + 1);
        const reports = getReportsByUser(user.id, selectedDate);
        
        return {
          ...user,
          children,
          reports,
          level
        };
      });
    };

    // Determine the starting point based on current user's role
    if (currentUserRole === 'CTO') {
      // CTO sees entire organization
      return buildTree(undefined, 0);
    } else if (currentUserRole === 'VP') {
      // VP sees their part of the organization
      const currentUser = ORGANIZATION_USERS.find(u => u.role === 'VP');
      return currentUser ? buildTree(currentUser.id, 0) : [];
    } else if (currentUserRole === 'Director') {
      const currentUser = ORGANIZATION_USERS.find(u => u.role === 'Director');
      return currentUser ? buildTree(currentUser.id, 0) : [];
    } else if (currentUserRole === 'Manager') {
      const currentUser = ORGANIZATION_USERS.find(u => u.role === 'Manager');
      return currentUser ? buildTree(currentUser.id, 0) : [];
    } else {
      // Engineers see limited view - just themselves
      const currentUser = currentUserId ? getUserById(currentUserId) : null;
      return currentUser ? [{
        ...currentUser,
        children: [],
        reports: getReportsByUser(currentUser.id, selectedDate),
        level: 0
      }] : [];
    }
  }, [currentUserRole, currentUserId, selectedDate]);

  const handleNodeToggle = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedUserId(nodeId);
    onUserSelect?.(nodeId);
  };

  const renderTreeNode = (node: TreeNode): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children.length > 0;
    const hasReports = (node.reports?.length || 0) > 0;
    const isSelected = selectedUserId === node.id;

    return (
      <TreeItem key={node.id} level={node.level}>
        <NodeContainer
          isSelected={isSelected}
          hasReports={hasReports}
          onClick={() => handleNodeClick(node.id)}
        >
          <ExpandButton
            isExpanded={isExpanded}
            hasChildren={hasChildren}
            onClick={(e) => {
              e.stopPropagation();
              handleNodeToggle(node.id);
            }}
          />
          
          <UserInfo>
            <UserName>{node.name}</UserName>
            <UserRole role={node.role}>{node.role}</UserRole>
            <ReportIndicator count={node.reports?.length || 0}>
              📝 {node.reports?.length || 0}
            </ReportIndicator>
          </UserInfo>
        </NodeContainer>

        {hasReports && (
          <ReportContent isVisible={isSelected}>
            {node.reports?.map(report => (
              <div key={report.id}>
                <ReportText>
                  {report.content.length > 150 
                    ? `${report.content.substring(0, 150)}...` 
                    : report.content
                  }
                </ReportText>
                <ReportDate>
                  {new Date(report.created_at).toLocaleString()}
                </ReportDate>
              </div>
            ))}
          </ReportContent>
        )}

        {isExpanded && hasChildren && (
          <div>
            {node.children.map(child => renderTreeNode(child))}
          </div>
        )}
      </TreeItem>
    );
  };

  const getTreeTitle = () => {
    switch (currentUserRole) {
      case 'CTO':
        return 'Organization Overview';
      case 'VP':
        return 'Division Overview';
      case 'Director':
        return 'Department Overview';
      case 'Manager':
        return 'Team Overview';
      case 'Engineer':
        return 'My Reports';
      default:
        return 'Organization';
    }
  };

  return (
    <TreeContainer>
      <TreeHeader>
        {getTreeTitle()} - {selectedDate}
      </TreeHeader>
      <TreeContent>
        {tree.length > 0 ? (
          tree.map(node => renderTreeNode(node))
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            No organizational data available for your role.
          </div>
        )}
      </TreeContent>
    </TreeContainer>
  );
};