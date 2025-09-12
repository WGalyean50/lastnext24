import type { Report, User, UserRole } from '../types';

interface AggregationRequest {
  reports: Report[];
  teamMembers: User[];
  managerRole: UserRole;
  date: string;
}

interface AggregationResponse {
  summary: string;
  aggregatedContent: string;
  keyHighlights: string[];
  reportingRate: {
    reported: number;
    total: number;
    percentage: number;
  };
}

interface SummarizeApiRequest {
  reports: Array<{
    author: string;
    role: string;
    content: string;
  }>;
  aggregation_level: string;
  date: string;
}

interface SummarizeApiResponse {
  success: boolean;
  summary: string;
  aggregated_content: string;
  key_highlights: string[];
  processing_time: number;
  token_count: number;
  error?: string;
}

class ReportAggregationService {
  private readonly API_BASE_URL = '';

  /**
   * Aggregates team reports into a summary for upward reporting
   */
  async aggregateReports({
    reports,
    teamMembers,
    managerRole,
    date
  }: AggregationRequest): Promise<AggregationResponse> {
    try {
      // Calculate reporting rate
      const reportingRate = {
        reported: reports.length,
        total: teamMembers.length,
        percentage: Math.round((reports.length / teamMembers.length) * 100)
      };

      // For now, use simple client-side aggregation
      // In the future, this could call the OpenAI summarization API
      const aggregationResult = await this.performClientSideAggregation(
        reports,
        teamMembers,
        managerRole,
        date
      );

      return {
        summary: aggregationResult.summary,
        aggregatedContent: aggregationResult.content,
        keyHighlights: aggregationResult.highlights,
        reportingRate
      };
    } catch (error) {
      console.error('Error aggregating reports:', error);
      throw new Error('Failed to aggregate team reports');
    }
  }

  /**
   * Enhanced aggregation using OpenAI summarization API
   */
  async aggregateReportsWithAI({
    reports,
    teamMembers,
    managerRole,
    date
  }: AggregationRequest): Promise<AggregationResponse> {
    try {
      const reportData = reports.map(report => {
        const author = teamMembers.find(member => member.id === report.user_id);
        return {
          author: author?.name || 'Unknown',
          role: author?.role || 'Unknown',
          content: report.content
        };
      });

      const requestData: SummarizeApiRequest = {
        reports: reportData,
        aggregation_level: managerRole.toLowerCase(),
        date
      };

      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result: SummarizeApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Summarization failed');
      }

      const reportingRate = {
        reported: reports.length,
        total: teamMembers.length,
        percentage: Math.round((reports.length / teamMembers.length) * 100)
      };

      return {
        summary: result.summary,
        aggregatedContent: result.aggregated_content,
        keyHighlights: result.key_highlights,
        reportingRate
      };
    } catch (error) {
      console.error('Error with AI aggregation, falling back to client-side:', error);
      
      // Fall back to client-side aggregation
      return await this.aggregateReports({
        reports,
        teamMembers,
        managerRole,
        date
      });
    }
  }

  /**
   * Simple client-side aggregation logic
   */
  private async performClientSideAggregation(
    reports: Report[],
    teamMembers: User[],
    managerRole: UserRole,
    date: string
  ): Promise<{ summary: string; content: string; highlights: string[] }> {
    const reportingRate = Math.round((reports.length / teamMembers.length) * 100);
    
    // Generate summary
    const summary = this.generateExecutiveSummary(reports, teamMembers, reportingRate, date);
    
    // Create detailed content with individual reports
    const detailedReports = reports.map(report => {
      const author = teamMembers.find(member => member.id === report.user_id);
      return `**${author?.name || 'Unknown'} (${author?.role || 'Unknown'})**:\n${report.content}`;
    }).join('\n\n---\n\n');
    
    const content = `${summary}\n\n## Detailed Team Reports:\n\n${detailedReports}`;
    
    // Extract key highlights
    const highlights = this.extractKeyHighlights(reports);
    
    return { summary, content, highlights };
  }

  /**
   * Generate executive summary
   */
  private generateExecutiveSummary(
    reports: Report[],
    teamMembers: User[],
    reportingRate: number,
    date: string
  ): string {
    const formattedDate = new Date(date).toLocaleDateString();
    
    return `## Team Summary for ${formattedDate}

**Reporting Rate**: ${reports.length}/${teamMembers.length} team members (${reportingRate}%)

**Overview**: ${this.generateOverviewText(reports, reportingRate)}

**Team Status**: ${this.generateTeamStatus(reports, teamMembers)}

**Manager Notes**: This aggregated report combines insights from ${reports.length} team member reports for effective upward communication.`;
  }

  /**
   * Generate overview text based on reports
   */
  private generateOverviewText(reports: Report[], reportingRate: number): string {
    if (reportingRate >= 80) {
      return 'Team is actively engaged with strong communication and progress across multiple initiatives.';
    } else if (reportingRate >= 60) {
      return 'Good team engagement with most members providing regular updates on their work.';
    } else if (reportingRate >= 40) {
      return 'Moderate team reporting with some members actively communicating progress.';
    } else {
      return 'Limited team reporting this period. Follow-up with team members may be needed.';
    }
  }

  /**
   * Generate team status summary
   */
  private generateTeamStatus(reports: Report[], teamMembers: User[]): string {
    const totalWords = reports.reduce((sum, report) => sum + report.content.split(' ').length, 0);
    const avgWordsPerReport = Math.round(totalWords / Math.max(reports.length, 1));
    
    const statusElements = [
      'Multiple projects and initiatives in progress',
      'Regular communication and updates being provided',
      `Average report depth: ${avgWordsPerReport} words`
    ];
    
    if (reports.some(report => report.content.toLowerCase().includes('blocked') || 
                              report.content.toLowerCase().includes('issue') ||
                              report.content.toLowerCase().includes('problem'))) {
      statusElements.push('Some challenges or blockers identified - requiring attention');
    } else {
      statusElements.push('No significant blockers or issues reported');
    }
    
    return statusElements.join('. ');
  }

  /**
   * Extract key highlights from reports
   */
  private extractKeyHighlights(reports: Report[]): string[] {
    const highlights: string[] = [];
    const keyWords = ['completed', 'finished', 'launched', 'deployed', 'delivered', 'achieved'];
    const issueWords = ['blocked', 'issue', 'problem', 'delayed', 'stuck'];
    
    reports.forEach(report => {
      const content = report.content.toLowerCase();
      
      // Look for completions
      keyWords.forEach(word => {
        if (content.includes(word)) {
          const sentences = report.content.split(/[.!?]+/);
          const relevantSentence = sentences.find(s => s.toLowerCase().includes(word));
          if (relevantSentence && relevantSentence.trim().length > 0) {
            highlights.push(`✅ ${relevantSentence.trim()}`);
          }
        }
      });
      
      // Look for issues
      issueWords.forEach(word => {
        if (content.includes(word)) {
          const sentences = report.content.split(/[.!?]+/);
          const relevantSentence = sentences.find(s => s.toLowerCase().includes(word));
          if (relevantSentence && relevantSentence.trim().length > 0) {
            highlights.push(`⚠️ ${relevantSentence.trim()}`);
          }
        }
      });
    });
    
    // Deduplicate and limit highlights
    return [...new Set(highlights)].slice(0, 5);
  }

  /**
   * Format aggregated report for different management levels
   */
  formatForManagementLevel(content: string, fromRole: UserRole, toRole: UserRole): string {
    // Adjust the level of detail based on the reporting chain
    if (toRole === 'CTO' && fromRole === 'Manager') {
      // More summary when going from Manager to CTO (skip Director/VP levels)
      return this.createExecutiveSummary(content);
    } else if (toRole === 'VP' && fromRole === 'Manager') {
      // Moderate detail for Manager to VP
      return this.createMidLevelSummary(content);
    }
    
    // Default: return as-is
    return content;
  }

  private createExecutiveSummary(content: string): string {
    // Extract just the summary section and key highlights for executive level
    const summaryMatch = content.match(/## Team Summary[^#]*/);
    return summaryMatch ? summaryMatch[0] : content.substring(0, 500) + '...';
  }

  private createMidLevelSummary(content: string): string {
    // Include summary and some key details, but not full individual reports
    const lines = content.split('\n');
    const summaryEndIndex = lines.findIndex(line => line.includes('## Detailed Team Reports'));
    
    if (summaryEndIndex > -1) {
      return lines.slice(0, summaryEndIndex).join('\n');
    }
    
    return content;
  }
}

// Export singleton instance
export const reportAggregationService = new ReportAggregationService();
export default reportAggregationService;