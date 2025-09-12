import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createOpenAIClient, handleOpenAIError, SummarizationError } from './lib/openai';

// Define the expected request format
interface SummarizeRequest {
  reports: string[];
  context?: string;
  summaryType?: 'individual' | 'aggregate' | 'executive';
  maxLength?: number;
}

// Define the expected response format
interface SummarizeResponse {
  success: boolean;
  summary?: string;
  individualSummaries?: string[];
  error?: string;
  processingTime?: number;
  tokenCount?: number;
}

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
    } as SummarizeResponse);
    return;
  }

  try {
    // Validate request body
    if (!req.body) {
      res.status(400).json({
        success: false,
        error: 'Request body is required'
      } as SummarizeResponse);
      return;
    }

    const { reports, context, summaryType = 'aggregate', maxLength = 500 }: SummarizeRequest = req.body;

    if (!reports || !Array.isArray(reports) || reports.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Reports array is required and must not be empty'
      } as SummarizeResponse);
      return;
    }

    // Validate that reports contain text
    const validReports = reports.filter(report => report && typeof report === 'string' && report.trim().length > 0);
    if (validReports.length === 0) {
      res.status(400).json({
        success: false,
        error: 'At least one valid report is required'
      } as SummarizeResponse);
      return;
    }

    // Create OpenAI client
    const openai = createOpenAIClient();

    // Record start time for processing duration
    const startTime = Date.now();

    // Generate appropriate summary based on type
    let summary: string;
    let individualSummaries: string[] | undefined;

    switch (summaryType) {
      case 'individual':
        individualSummaries = await generateIndividualSummaries(openai, validReports, maxLength);
        summary = individualSummaries.join('\n\n---\n\n');
        break;
      
      case 'executive':
        summary = await generateExecutiveSummary(openai, validReports, context, maxLength);
        break;
      
      case 'aggregate':
      default:
        summary = await generateAggregateSummary(openai, validReports, context, maxLength);
        break;
    }

    const processingTime = Date.now() - startTime;

    // Return successful response
    res.status(200).json({
      success: true,
      summary,
      individualSummaries,
      processingTime,
      tokenCount: estimateTokenCount(summary)
    } as SummarizeResponse);

  } catch (error) {
    console.error('Summarization error:', error);
    
    try {
      handleOpenAIError(error, 'summarization');
    } catch (handledError) {
      if (handledError instanceof SummarizationError) {
        res.status(500).json({
          success: false,
          error: handledError.message
        } as SummarizeResponse);
        return;
      }
    }

    // Fallback error response
    res.status(500).json({
      success: false,
      error: 'Internal server error during summarization'
    } as SummarizeResponse);
  }
}

// Generate individual summaries for each report
async function generateIndividualSummaries(
  openai: any,
  reports: string[],
  maxLength: number
): Promise<string[]> {
  const summaries: string[] = [];
  
  for (const report of reports) {
    const prompt = createIndividualSummaryPrompt(report, maxLength);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: Math.min(maxLength * 2, 1000),
      temperature: 0.3,
    });

    const summary = completion.choices[0]?.message?.content?.trim() || 'Unable to generate summary';
    summaries.push(summary);
  }
  
  return summaries;
}

// Generate aggregate summary combining all reports
async function generateAggregateSummary(
  openai: any,
  reports: string[],
  context?: string,
  maxLength: number = 500
): Promise<string> {
  const prompt = createAggregateSummaryPrompt(reports, context, maxLength);
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: Math.min(maxLength * 3, 1500),
    temperature: 0.3,
  });

  return completion.choices[0]?.message?.content?.trim() || 'Unable to generate summary';
}

// Generate executive summary for leadership
async function generateExecutiveSummary(
  openai: any,
  reports: string[],
  context?: string,
  maxLength: number = 500
): Promise<string> {
  const prompt = createExecutiveSummaryPrompt(reports, context, maxLength);
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: Math.min(maxLength * 3, 1500),
    temperature: 0.2, // Lower temperature for executive summaries
  });

  return completion.choices[0]?.message?.content?.trim() || 'Unable to generate summary';
}

// Create prompt for individual report summary
function createIndividualSummaryPrompt(report: string, maxLength: number): string {
  return `Please summarize the following team member report in approximately ${maxLength} characters or less. Focus on:
- Key accomplishments and progress
- Current challenges or blockers
- Next steps or priorities

Report:
${report}

Summary:`;
}

// Create prompt for aggregate summary
function createAggregateSummaryPrompt(reports: string[], context?: string, maxLength: number): string {
  const contextSection = context ? `\nContext: ${context}\n` : '';
  
  return `Please create an aggregate summary of the following team reports in approximately ${maxLength} characters or less. ${contextSection}

Focus on:
- Overall team progress and achievements
- Common themes and patterns
- Key challenges across the team
- Priority items that need attention

Reports:
${reports.map((report, index) => `Report ${index + 1}: ${report}`).join('\n\n')}

Aggregate Summary:`;
}

// Create prompt for executive summary
function createExecutiveSummaryPrompt(reports: string[], context?: string, maxLength: number): string {
  const contextSection = context ? `\nContext: ${context}\n` : '';
  
  return `Please create an executive summary of the following team reports for leadership review in approximately ${maxLength} characters or less. ${contextSection}

Focus on:
- High-level business impact and outcomes
- Critical risks or blockers requiring leadership attention
- Strategic wins and progress on key objectives
- Resource needs or recommendations

Present this as a concise, actionable summary suitable for executive decision-making.

Reports:
${reports.map((report, index) => `Report ${index + 1}: ${report}`).join('\n\n')}

Executive Summary:`;
}

// Simple token count estimation
function estimateTokenCount(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}