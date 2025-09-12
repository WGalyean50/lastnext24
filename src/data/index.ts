// Static demo data for LastNext24 MVP
import type { User, Project, Report } from '../types';

/**
 * Static organization hierarchy data
 * Structure: CTO (1) → VP (2) → Director (4) → Manager (8) → Engineer (24)
 * Total: 39 users (1+2+4+8+24)
 */
export const ORGANIZATION_USERS: User[] = [
  // CTO Level (1)
  {
    id: 'cto-001',
    name: 'Sarah Chen',
    role: 'CTO',
    manager_id: undefined
  },

  // VP Level (2)
  {
    id: 'vp-001',
    name: 'Michael Rodriguez',
    role: 'VP',
    manager_id: 'cto-001'
  },
  {
    id: 'vp-002',
    name: 'Jennifer Kim',
    role: 'VP',
    manager_id: 'cto-001'
  },

  // Director Level (4)
  {
    id: 'dir-001',
    name: 'David Thompson',
    role: 'Director',
    manager_id: 'vp-001'
  },
  {
    id: 'dir-002',
    name: 'Lisa Wang',
    role: 'Director',
    manager_id: 'vp-001'
  },
  {
    id: 'dir-003',
    name: 'Robert Johnson',
    role: 'Director',
    manager_id: 'vp-002'
  },
  {
    id: 'dir-004',
    name: 'Amanda Foster',
    role: 'Director',
    manager_id: 'vp-002'
  },

  // Manager Level (8)
  {
    id: 'mgr-001',
    name: 'Kevin Park',
    role: 'Manager',
    manager_id: 'dir-001'
  },
  {
    id: 'mgr-002',
    name: 'Jessica Martinez',
    role: 'Manager',
    manager_id: 'dir-001'
  },
  {
    id: 'mgr-003',
    name: 'Thomas Lee',
    role: 'Manager',
    manager_id: 'dir-002'
  },
  {
    id: 'mgr-004',
    name: 'Rachel Brown',
    role: 'Manager',
    manager_id: 'dir-002'
  },
  {
    id: 'mgr-005',
    name: 'Daniel Garcia',
    role: 'Manager',
    manager_id: 'dir-003'
  },
  {
    id: 'mgr-006',
    name: 'Emily Davis',
    role: 'Manager',
    manager_id: 'dir-003'
  },
  {
    id: 'mgr-007',
    name: 'Christopher Wilson',
    role: 'Manager',
    manager_id: 'dir-004'
  },
  {
    id: 'mgr-008',
    name: 'Samantha Taylor',
    role: 'Manager',
    manager_id: 'dir-004'
  },

  // Engineer Level (24)
  // Team 1 (mgr-001)
  {
    id: 'eng-001',
    name: 'Alex Rivera',
    role: 'Engineer',
    manager_id: 'mgr-001'
  },
  {
    id: 'eng-002',
    name: 'Maya Patel',
    role: 'Engineer',
    manager_id: 'mgr-001'
  },
  {
    id: 'eng-003',
    name: 'James Cooper',
    role: 'Engineer',
    manager_id: 'mgr-001'
  },
  
  // Team 2 (mgr-002)
  {
    id: 'eng-004',
    name: 'Sophie Zhang',
    role: 'Engineer',
    manager_id: 'mgr-002'
  },
  {
    id: 'eng-005',
    name: 'Marcus Johnson',
    role: 'Engineer',
    manager_id: 'mgr-002'
  },
  {
    id: 'eng-006',
    name: 'Olivia Chen',
    role: 'Engineer',
    manager_id: 'mgr-002'
  },

  // Team 3 (mgr-003)
  {
    id: 'eng-007',
    name: 'Ryan O\'Connor',
    role: 'Engineer',
    manager_id: 'mgr-003'
  },
  {
    id: 'eng-008',
    name: 'Priya Sharma',
    role: 'Engineer',
    manager_id: 'mgr-003'
  },
  {
    id: 'eng-009',
    name: 'Ben Miller',
    role: 'Engineer',
    manager_id: 'mgr-003'
  },

  // Team 4 (mgr-004)
  {
    id: 'eng-010',
    name: 'Grace Liu',
    role: 'Engineer',
    manager_id: 'mgr-004'
  },
  {
    id: 'eng-011',
    name: 'Carlos Rodriguez',
    role: 'Engineer',
    manager_id: 'mgr-004'
  },
  {
    id: 'eng-012',
    name: 'Zoe Anderson',
    role: 'Engineer',
    manager_id: 'mgr-004'
  },

  // Team 5 (mgr-005)
  {
    id: 'eng-013',
    name: 'Nathan Kim',
    role: 'Engineer',
    manager_id: 'mgr-005'
  },
  {
    id: 'eng-014',
    name: 'Isabella Wright',
    role: 'Engineer',
    manager_id: 'mgr-005'
  },
  {
    id: 'eng-015',
    name: 'Tyler Scott',
    role: 'Engineer',
    manager_id: 'mgr-005'
  },

  // Team 6 (mgr-006)
  {
    id: 'eng-016',
    name: 'Hannah Martinez',
    role: 'Engineer',
    manager_id: 'mgr-006'
  },
  {
    id: 'eng-017',
    name: 'Jordan Thompson',
    role: 'Engineer',
    manager_id: 'mgr-006'
  },
  {
    id: 'eng-018',
    name: 'Ethan Lewis',
    role: 'Engineer',
    manager_id: 'mgr-006'
  },

  // Team 7 (mgr-007)
  {
    id: 'eng-019',
    name: 'Chloe Davis',
    role: 'Engineer',
    manager_id: 'mgr-007'
  },
  {
    id: 'eng-020',
    name: 'Lucas Green',
    role: 'Engineer',
    manager_id: 'mgr-007'
  },
  {
    id: 'eng-021',
    name: 'Ava Wilson',
    role: 'Engineer',
    manager_id: 'mgr-007'
  },

  // Team 8 (mgr-008)
  {
    id: 'eng-022',
    name: 'Noah Turner',
    role: 'Engineer',
    manager_id: 'mgr-008'
  },
  {
    id: 'eng-023',
    name: 'Emma Garcia',
    role: 'Engineer',
    manager_id: 'mgr-008'
  },
  {
    id: 'eng-024',
    name: 'Liam Foster',
    role: 'Engineer',
    manager_id: 'mgr-008'
  }
];

/**
 * Static project data for demo purposes
 * 3-4 projects per team/manager
 */
export const DEMO_PROJECTS: Project[] = [
  // Team 1 Projects (mgr-001)
  {
    id: 'proj-001',
    name: 'User Authentication System',
    team_id: 'mgr-001',
    description: 'Implement OAuth 2.0 and multi-factor authentication'
  },
  {
    id: 'proj-002',
    name: 'Mobile App API',
    team_id: 'mgr-001',
    description: 'RESTful API development for mobile application'
  },
  {
    id: 'proj-003',
    name: 'Performance Optimization',
    team_id: 'mgr-001',
    description: 'Database query optimization and caching implementation'
  },

  // Team 2 Projects (mgr-002)
  {
    id: 'proj-004',
    name: 'Payment Integration',
    team_id: 'mgr-002',
    description: 'Stripe and PayPal payment processing integration'
  },
  {
    id: 'proj-005',
    name: 'Admin Dashboard',
    team_id: 'mgr-002',
    description: 'React-based administrative interface'
  },
  {
    id: 'proj-006',
    name: 'Email Service',
    team_id: 'mgr-002',
    description: 'Automated email notifications and templates'
  },

  // Team 3 Projects (mgr-003)
  {
    id: 'proj-007',
    name: 'Data Pipeline',
    team_id: 'mgr-003',
    description: 'ETL pipeline for analytics and reporting'
  },
  {
    id: 'proj-008',
    name: 'Machine Learning Model',
    team_id: 'mgr-003',
    description: 'Recommendation engine development'
  },
  {
    id: 'proj-009',
    name: 'API Gateway',
    team_id: 'mgr-003',
    description: 'Microservices API gateway implementation'
  },

  // Team 4 Projects (mgr-004)
  {
    id: 'proj-010',
    name: 'Frontend Redesign',
    team_id: 'mgr-004',
    description: 'User interface modernization project'
  },
  {
    id: 'proj-011',
    name: 'Mobile App Development',
    team_id: 'mgr-004',
    description: 'React Native cross-platform mobile application'
  },
  {
    id: 'proj-012',
    name: 'Accessibility Improvements',
    team_id: 'mgr-004',
    description: 'WCAG compliance and screen reader support'
  },

  // Team 5 Projects (mgr-005)
  {
    id: 'proj-013',
    name: 'Cloud Migration',
    team_id: 'mgr-005',
    description: 'AWS infrastructure migration and optimization'
  },
  {
    id: 'proj-014',
    name: 'Security Audit',
    team_id: 'mgr-005',
    description: 'Comprehensive security review and improvements'
  },
  {
    id: 'proj-015',
    name: 'Monitoring System',
    team_id: 'mgr-005',
    description: 'Application performance monitoring setup'
  },

  // Team 6 Projects (mgr-006)
  {
    id: 'proj-016',
    name: 'Search Functionality',
    team_id: 'mgr-006',
    description: 'Elasticsearch-based search implementation'
  },
  {
    id: 'proj-017',
    name: 'Reporting Dashboard',
    team_id: 'mgr-006',
    description: 'Real-time analytics and reporting interface'
  },
  {
    id: 'proj-018',
    name: 'Content Management',
    team_id: 'mgr-006',
    description: 'CMS for dynamic content management'
  },

  // Team 7 Projects (mgr-007)
  {
    id: 'proj-019',
    name: 'Integration Platform',
    team_id: 'mgr-007',
    description: 'Third-party service integration framework'
  },
  {
    id: 'proj-020',
    name: 'Testing Automation',
    team_id: 'mgr-007',
    description: 'Automated testing pipeline and CI/CD improvements'
  },
  {
    id: 'proj-021',
    name: 'Documentation System',
    team_id: 'mgr-007',
    description: 'Technical documentation platform development'
  },

  // Team 8 Projects (mgr-008)
  {
    id: 'proj-022',
    name: 'Backup System',
    team_id: 'mgr-008',
    description: 'Automated backup and disaster recovery solution'
  },
  {
    id: 'proj-023',
    name: 'Chat Integration',
    team_id: 'mgr-008',
    description: 'Real-time messaging and notification system'
  },
  {
    id: 'proj-024',
    name: 'Workflow Automation',
    team_id: 'mgr-008',
    description: 'Business process automation and orchestration'
  }
];

// Utility functions for working with organization data

/**
 * Get all direct reports for a given manager
 */
export const getDirectReports = (managerId: string): User[] => {
  return ORGANIZATION_USERS.filter(user => user.manager_id === managerId);
};

/**
 * Get all team members under a manager (recursive)
 */
export const getAllTeamMembers = (managerId: string): User[] => {
  const directReports = getDirectReports(managerId);
  const allMembers = [...directReports];
  
  directReports.forEach(report => {
    if (report.role !== 'Engineer') {
      allMembers.push(...getAllTeamMembers(report.id));
    }
  });
  
  return allMembers;
};

/**
 * Get user by ID
 */
export const getUserById = (userId: string): User | undefined => {
  return ORGANIZATION_USERS.find(user => user.id === userId);
};

/**
 * Get manager for a given user
 */
export const getManager = (userId: string): User | undefined => {
  const user = getUserById(userId);
  if (!user?.manager_id) return undefined;
  return getUserById(user.manager_id);
};

/**
 * Get projects for a specific team/manager
 */
export const getProjectsByTeam = (teamId: string): Project[] => {
  return DEMO_PROJECTS.filter(project => project.team_id === teamId);
};

/**
 * Pre-populated demo reports for demonstration purposes
 * Covers various report types and scenarios across the organization
 */
export const DEMO_REPORTS: Report[] = [
  // Engineer reports - today's date
  {
    id: 'rpt-001',
    user_id: 'eng-001',
    date: '2025-09-11',
    content: 'Completed OAuth 2.0 integration testing with Google and GitHub providers. Fixed 3 edge cases in token refresh logic. Started work on multi-factor authentication flow. Need design review for the SMS verification UI component by Friday.',
    summary: 'OAuth integration complete, MFA UI design review needed',
    created_at: '2025-09-11T08:30:00Z',
    updated_at: '2025-09-11T08:30:00Z'
  },
  {
    id: 'rpt-002',
    user_id: 'eng-002',
    date: '2025-09-11',
    content: 'Refactored user authentication middleware for better performance. Reduced average response time by 40ms. Discovered a potential security vulnerability in password reset flow - created ticket AUTH-245 to address. Planning to pair with James tomorrow on API rate limiting.',
    summary: 'Auth middleware optimized, security issue identified and ticketed',
    created_at: '2025-09-11T09:15:00Z',
    updated_at: '2025-09-11T09:15:00Z'
  },
  {
    id: 'rpt-003',
    user_id: 'eng-003',
    date: '2025-09-11',
    content: 'Database migration scripts ready for the authentication schema changes. Tested on staging environment successfully. Performance benchmarks show 15% improvement in query speed. Will coordinate with DevOps team for production deployment next Tuesday.',
    summary: 'DB migration ready, 15% performance improvement validated',
    created_at: '2025-09-11T10:00:00Z',
    updated_at: '2025-09-11T10:00:00Z'
  },

  // More engineers from different teams
  {
    id: 'rpt-004',
    user_id: 'eng-004',
    date: '2025-09-11',
    content: 'Stripe payment integration is 90% complete. Webhook handlers for payment success/failure events are working. Still debugging the subscription renewal flow - getting inconsistent responses from Stripe API. Meeting with their support team tomorrow.',
    summary: 'Stripe integration nearly done, subscription renewal debugging in progress',
    created_at: '2025-09-11T08:45:00Z',
    updated_at: '2025-09-11T08:45:00Z'
  },
  {
    id: 'rpt-005',
    user_id: 'eng-005',
    date: '2025-09-11',
    content: 'Admin dashboard React components are ready for review. Implemented data tables, user management, and analytics widgets. Used TypeScript throughout with 95% coverage. Need feedback on the chart library choice - considering Chart.js vs Recharts.',
    summary: 'Admin dashboard components ready, chart library feedback needed',
    created_at: '2025-09-11T11:20:00Z',
    updated_at: '2025-09-11T11:20:00Z'
  },
  {
    id: 'rpt-006',
    user_id: 'eng-013',
    date: '2025-09-11',
    content: 'AWS migration preparation going well. Containerized 3 microservices using Docker. Set up ECS clusters and load balancers. Estimated cost savings of 30% compared to current infrastructure. Security group configurations need final review.',
    summary: 'AWS migration on track, 30% cost savings projected',
    created_at: '2025-09-11T09:30:00Z',
    updated_at: '2025-09-11T09:30:00Z'
  },

  // Manager reports - aggregating team updates
  {
    id: 'rpt-101',
    user_id: 'mgr-001',
    date: '2025-09-11',
    content: 'Authentication team making excellent progress. OAuth integration completed with Google/GitHub, MFA flow in development. Discovered security vulnerability in password reset - being addressed. Database migration ready with 15% performance improvement. Team is on track for Q4 delivery.',
    summary: 'Authentication project on track, security issue identified and being resolved',
    created_at: '2025-09-11T16:00:00Z',
    updated_at: '2025-09-11T16:00:00Z'
  },
  {
    id: 'rpt-102',
    user_id: 'mgr-002',
    date: '2025-09-11',
    content: 'Payments team nearly finished Stripe integration - subscription flow debugging in progress. Admin dashboard components ready for review, excellent TypeScript coverage. Team requesting decision on chart library. Overall project 80% complete, on budget.',
    summary: 'Payments integration 80% complete, admin dashboard ready for review',
    created_at: '2025-09-11T16:15:00Z',
    updated_at: '2025-09-11T16:15:00Z'
  },
  {
    id: 'rpt-103',
    user_id: 'mgr-005',
    date: '2025-09-11',
    content: 'Cloud migration team ahead of schedule. Successfully containerized 3 microservices with proper ECS setup. Projecting 30% cost savings versus current infrastructure. Security configurations under final review. Migration pilot scheduled for next month.',
    summary: 'Cloud migration ahead of schedule with significant cost savings',
    created_at: '2025-09-11T16:30:00Z',
    updated_at: '2025-09-11T16:30:00Z'
  },

  // Director-level reports - higher level summaries
  {
    id: 'rpt-201',
    user_id: 'dir-001',
    date: '2025-09-11',
    content: 'Engineering teams under my oversight are performing well. Authentication and payments projects both on track for Q4 delivery. Key wins: OAuth integration complete, 15% DB performance improvement, admin dashboard ready. One security issue identified and being addressed promptly. Team morale high.',
    summary: 'Engineering teams on track, key milestones achieved, security issue being addressed',
    created_at: '2025-09-11T17:00:00Z',
    updated_at: '2025-09-11T17:00:00Z'
  },
  {
    id: 'rpt-202',
    user_id: 'dir-003',
    date: '2025-09-11',
    content: 'Cloud infrastructure initiatives showing strong progress. Migration project ahead of schedule with 30% projected cost savings. Team has successfully modernized deployment pipeline. Security reviews proceeding smoothly. Confident in meeting all Q4 infrastructure goals.',
    summary: 'Infrastructure projects exceeding expectations with significant cost benefits',
    created_at: '2025-09-11T17:15:00Z',
    updated_at: '2025-09-11T17:15:00Z'
  },

  // VP-level reports - strategic overview
  {
    id: 'rpt-301',
    user_id: 'vp-001',
    date: '2025-09-11',
    content: 'Product engineering division maintaining strong delivery momentum. Authentication, payments, and admin systems all progressing well toward Q4 targets. Proactive security practices paying off - team caught and is resolving potential vulnerability. Database optimizations delivering measurable performance gains. Team leads demonstrating excellent technical judgment.',
    summary: 'Product engineering on track with strong security practices and performance improvements',
    created_at: '2025-09-11T18:00:00Z',
    updated_at: '2025-09-11T18:00:00Z'
  },
  {
    id: 'rpt-302',
    user_id: 'vp-002',
    date: '2025-09-11',
    content: 'Infrastructure and platform teams delivering exceptional value. Cloud migration project not only ahead of schedule but also projecting 30% cost reduction. Modern containerization strategy proving highly effective. Security posture strengthening with systematic reviews. Very pleased with team execution.',
    summary: 'Infrastructure teams exceeding targets with significant cost optimizations',
    created_at: '2025-09-11T18:15:00Z',
    updated_at: '2025-09-11T18:15:00Z'
  },

  // Yesterday's reports for historical context
  {
    id: 'rpt-y001',
    user_id: 'eng-001',
    date: '2025-09-10',
    content: 'Set up OAuth 2.0 development environment and completed initial integration with Google. Reviewed API documentation for GitHub OAuth. Identified 5 test scenarios for tomorrow\'s testing. Blocked on UX mockups for the login flow.',
    summary: 'OAuth setup complete, testing scenarios identified',
    created_at: '2025-09-10T09:00:00Z',
    updated_at: '2025-09-10T09:00:00Z'
  },
  {
    id: 'rpt-y002',
    user_id: 'eng-007',
    date: '2025-09-10',
    content: 'Completed API gateway configuration for microservices routing. Load tested with 1000 concurrent requests - performance looks good. Documented the new endpoint structure. Tomorrow will integrate with the authentication service that Alex is building.',
    summary: 'API gateway configured and load tested successfully',
    created_at: '2025-09-10T14:30:00Z',
    updated_at: '2025-09-10T14:30:00Z'
  },
  {
    id: 'rpt-y003',
    user_id: 'mgr-001',
    date: '2025-09-10',
    content: 'Team planning session went well. OAuth and MFA work planned for this week. Alex is unblocked on UX mockups. James has migration scripts ready for testing. Maya is working on middleware optimizations. Team velocity looking strong for sprint close.',
    summary: 'Team planning complete, good velocity expected',
    created_at: '2025-09-10T16:45:00Z',
    updated_at: '2025-09-10T16:45:00Z'
  }
];

/**
 * Get reports for a specific user
 */
export const getReportsByUser = (userId: string, date?: string): Report[] => {
  let reports = DEMO_REPORTS.filter(report => report.user_id === userId);
  if (date) {
    reports = reports.filter(report => report.date === date);
  }
  return reports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

/**
 * Get reports for a specific date across the organization
 */
export const getReportsByDate = (date: string): Report[] => {
  return DEMO_REPORTS.filter(report => report.date === date)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

/**
 * Get reports from a user's team (direct reports)
 */
export const getTeamReports = (managerId: string, date?: string): Report[] => {
  const teamMembers = getDirectReports(managerId);
  const teamUserIds = teamMembers.map(user => user.id);
  
  let reports = DEMO_REPORTS.filter(report => teamUserIds.includes(report.user_id));
  if (date) {
    reports = reports.filter(report => report.date === date);
  }
  return reports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};