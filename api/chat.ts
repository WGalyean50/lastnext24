import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createOpenAIClient, handleOpenAIError, ChatError } from './lib/openai';

// Define the expected request format
interface ChatRequest {
  query: string;
  user_role: 'CTO' | 'VP' | 'Director' | 'Manager' | 'Engineer';
  user_id?: string;
  context_date?: string; // ISO date string (YYYY-MM-DD)
  max_sources?: number; // limit number of report citations
}

// Define the expected response format
interface ChatResponse {
  success: boolean;
  response?: string;
  sources?: ReportSource[];
  error?: string;
  processingTime?: number;
  tokenCount?: number;
}

// Report source for citations
interface ReportSource {
  user_id: string;
  user_name: string;
  user_role: string;
  date: string;
  content_snippet: string; // truncated content for citation
  relevance_score: number; // 0-1 relevance to query
}

// Mock data structure matching frontend
interface User {
  id: string;
  name: string;
  role: string;
  manager_id?: string;
}

interface Report {
  id: string;
  user_id: string;
  date: string;
  content: string;
  summary?: string;
  created_at: string;
  updated_at: string;
}

// Mock organizational data for demo (simplified version from frontend)
const MOCK_USERS: User[] = [
  { id: 'cto-001', name: 'Sarah Chen', role: 'CTO' },
  { id: 'vp-001', name: 'Michael Rodriguez', role: 'VP', manager_id: 'cto-001' },
  { id: 'vp-002', name: 'Jennifer Kim', role: 'VP', manager_id: 'cto-001' },
  { id: 'dir-001', name: 'David Thompson', role: 'Director', manager_id: 'vp-001' },
  { id: 'dir-002', name: 'Lisa Wang', role: 'Director', manager_id: 'vp-001' },
  { id: 'dir-003', name: 'Robert Johnson', role: 'Director', manager_id: 'vp-002' },
  { id: 'dir-004', name: 'Amanda Foster', role: 'Director', manager_id: 'vp-002' },
  { id: 'mgr-001', name: 'Kevin Park', role: 'Manager', manager_id: 'dir-001' },
  { id: 'mgr-002', name: 'Jessica Martinez', role: 'Manager', manager_id: 'dir-001' },
  { id: 'eng-001', name: 'Alex Johnson', role: 'Engineer', manager_id: 'mgr-001' },
  { id: 'eng-002', name: 'Maria Garcia', role: 'Engineer', manager_id: 'mgr-001' },
  { id: 'eng-003', name: 'James Liu', role: 'Engineer', manager_id: 'mgr-002' },
];

// Mock reports data for demo
const MOCK_REPORTS: Report[] = [
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
    content: 'Implemented real-time notification system using WebSocket connections. Added offline queue for failed notifications. Working on push notification integration for mobile apps. Blocked on Apple Push Notification certificates - need DevOps team help.',
    summary: 'WebSocket notifications implemented, blocked on APNs certificates',
    created_at: '2025-09-11T10:00:00Z',
    updated_at: '2025-09-11T10:00:00Z'
  }
];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    } as ChatResponse);
    return;
  }

  try {
    // Validate request body
    if (!req.body) {
      res.status(400).json({
        success: false,
        error: 'Request body is required'
      } as ChatResponse);
      return;
    }

    const { 
      query, 
      user_role, 
      user_id, 
      context_date = getCurrentDate(), 
      max_sources = 5 
    }: ChatRequest = req.body;

    if (!query || query.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Query is required and must not be empty'
      } as ChatResponse);
      return;
    }

    if (!user_role) {
      res.status(400).json({
        success: false,
        error: 'User role is required'
      } as ChatResponse);
      return;
    }

    // Create OpenAI client
    const openai = createOpenAIClient();

    // Record start time for processing duration
    const startTime = Date.now();

    // Step 1: Search and filter reports based on role permissions and context
    const relevantReports = searchReportsByRole(user_role, user_id, context_date);

    // Step 2: Build context and find most relevant reports for the query
    const contextWithSources = await buildQueryContext(openai, query, relevantReports, max_sources);

    // Step 3: Generate natural language response using GPT-4o
    const response = await generateChatResponse(openai, query, user_role, contextWithSources.context);

    const processingTime = Date.now() - startTime;

    // Return successful response with citations
    res.status(200).json({
      success: true,
      response,
      sources: contextWithSources.sources,
      processingTime,
      tokenCount: estimateTokenCount(response)
    } as ChatResponse);

  } catch (error) {
    console.error('Chat error:', error);
    
    try {
      handleOpenAIError(error, 'chat');
    } catch (handledError) {
      if (handledError instanceof ChatError) {
        res.status(500).json({
          success: false,
          error: handledError.message
        } as ChatResponse);
        return;
      }
    }

    // Fallback error response
    res.status(500).json({
      success: false,
      error: 'Internal server error during chat processing'
    } as ChatResponse);
  }
}

// Get current date in ISO format
function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Search reports based on user role and permissions
function searchReportsByRole(userRole: string, userId?: string, contextDate?: string): Report[] {
  let reports = MOCK_REPORTS;

  // Filter by date if specified
  if (contextDate) {
    reports = reports.filter(report => report.date === contextDate);
  }

  // Apply role-based filtering
  switch (userRole) {
    case 'Engineer':
      // Engineers can only see their own reports
      return userId ? reports.filter(r => r.user_id === userId) : [];
    
    case 'Manager':
      // Managers can see their team's reports
      const teamUserIds = getTeamUserIds(userId);
      return reports.filter(r => teamUserIds.includes(r.user_id));
    
    case 'Director':
    case 'VP':
    case 'CTO':
      // Leaders can see reports from their hierarchy
      const hierarchyUserIds = getHierarchyUserIds(userId, userRole);
      return reports.filter(r => hierarchyUserIds.includes(r.user_id));
    
    default:
      return reports; // Fallback - return all reports
  }
}

// Get team member IDs for a manager
function getTeamUserIds(managerId?: string): string[] {
  if (!managerId) return [];
  return MOCK_USERS.filter(u => u.manager_id === managerId).map(u => u.id);
}

// Get hierarchy user IDs for a leader
function getHierarchyUserIds(leaderId?: string, role?: string): string[] {
  if (!leaderId) return MOCK_USERS.map(u => u.id); // Return all if no specific leader
  
  // For demo purposes, return subset based on role level
  switch (role) {
    case 'Director':
      return MOCK_USERS.filter(u => ['Engineer', 'Manager'].includes(u.role)).map(u => u.id);
    case 'VP':
      return MOCK_USERS.filter(u => ['Engineer', 'Manager', 'Director'].includes(u.role)).map(u => u.id);
    case 'CTO':
      return MOCK_USERS.map(u => u.id); // CTO sees all
    default:
      return [];
  }
}

// Build query context with relevant reports and citations
async function buildQueryContext(
  openai: any, 
  query: string, 
  reports: Report[], 
  maxSources: number
): Promise<{ context: string; sources: ReportSource[] }> {
  if (reports.length === 0) {
    return { context: 'No relevant reports found for the specified time period.', sources: [] };
  }

  // Score and rank reports by relevance to query
  const scoredReports = await Promise.all(
    reports.map(async (report) => {
      const relevanceScore = await calculateRelevanceScore(openai, query, report.content);
      return { report, relevanceScore };
    })
  );

  // Sort by relevance and take top sources
  const topReports = scoredReports
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxSources);

  // Build sources for citations
  const sources: ReportSource[] = topReports.map(({ report, relevanceScore }) => {
    const user = MOCK_USERS.find(u => u.id === report.user_id);
    return {
      user_id: report.user_id,
      user_name: user?.name || 'Unknown User',
      user_role: user?.role || 'Unknown Role',
      date: report.date,
      content_snippet: truncateContent(report.content, 150),
      relevance_score: relevanceScore
    };
  });

  // Build context string for GPT
  const context = topReports
    .map(({ report }, index) => {
      const user = MOCK_USERS.find(u => u.id === report.user_id);
      return `[Source ${index + 1}] ${user?.name} (${user?.role}): ${report.content}`;
    })
    .join('\n\n');

  return { context, sources };
}

// Calculate relevance score using OpenAI embeddings (simplified for demo)
async function calculateRelevanceScore(openai: any, query: string, content: string): Promise<number> {
  try {
    // For demo purposes, use a simple keyword matching approach
    // In production, you'd use embeddings for semantic similarity
    const queryWords = query.toLowerCase().split(' ');
    const contentWords = content.toLowerCase().split(' ');
    
    const matchCount = queryWords.filter(word => 
      contentWords.some(cWord => cWord.includes(word) || word.includes(cWord))
    ).length;
    
    return Math.min(matchCount / queryWords.length, 1.0);
  } catch (error) {
    console.error('Error calculating relevance score:', error);
    return 0.5; // Default moderate relevance
  }
}

// Generate chat response using GPT-4o
async function generateChatResponse(
  openai: any, 
  query: string, 
  userRole: string, 
  context: string
): Promise<string> {
  const prompt = createChatPrompt(query, userRole, context);
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 800,
    temperature: 0.4, // Balanced creativity and consistency
  });

  return completion.choices[0]?.message?.content?.trim() || 'Unable to generate response';
}

// Create chat prompt for natural language processing
function createChatPrompt(query: string, userRole: string, context: string): string {
  return `You are an AI assistant helping a ${userRole} understand organizational reports and insights. Based on the provided context from team reports, answer the user's question in a helpful, professional manner.

Context from recent reports:
${context}

User Question: ${query}

Please provide a comprehensive response that:
1. Directly answers the question based on the available information
2. References specific team members and their reports when relevant
3. Identifies any patterns or trends across reports
4. Highlights any blockers or issues that need attention
5. Provides actionable insights appropriate for a ${userRole} role

If the context doesn't contain enough information to fully answer the question, acknowledge this limitation and suggest what additional information might be helpful.

Response:`;
}

// Truncate content for citation snippets
function truncateContent(content: string, maxLength: number): string {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength - 3) + '...';
}

// Simple token count estimation
function estimateTokenCount(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}