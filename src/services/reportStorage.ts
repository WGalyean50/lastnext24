import type { Report, UserRole } from '../types';

// Keys for localStorage
const REPORTS_KEY = 'lastnext24_reports';
const AUDIO_KEY_PREFIX = 'lastnext24_audio_';

export interface StoredReport extends Omit<Report, 'id'> {
  id?: string; // Make id optional for new reports
  title?: string; // Optional title for the report
  audio_blob_key?: string; // Key to retrieve audio from separate storage
  has_audio?: boolean; // Flag to indicate if there's associated audio
}

export interface CreateReportData {
  title?: string;
  content: string;
  date: string;
  audio_blob?: Blob;
  audio_duration?: number;
}

export class ReportStorageService {
  private static instance: ReportStorageService;

  public static getInstance(): ReportStorageService {
    if (!ReportStorageService.instance) {
      ReportStorageService.instance = new ReportStorageService();
    }
    return ReportStorageService.instance;
  }

  private constructor() {}

  private generateId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentUser(): { id: string; role: UserRole } {
    // Get current user from session storage (set by role selection)
    const role = sessionStorage.getItem('selectedRole') as UserRole;
    if (!role) {
      throw new Error('No user role selected');
    }
    
    // For demo purposes, we'll use a simple mapping of role to user ID
    // In a real app, this would come from authentication
    const userIdMap: Record<UserRole, string> = {
      'Engineer': 'user_engineer_demo',
      'Manager': 'user_manager_demo', 
      'Director': 'user_director_demo',
      'VP': 'user_vp_demo',
      'CTO': 'user_cto_demo'
    };

    return {
      id: userIdMap[role],
      role
    };
  }

  private getAllReports(): StoredReport[] {
    try {
      const reportsData = localStorage.getItem(REPORTS_KEY);
      return reportsData ? JSON.parse(reportsData) : [];
    } catch (error) {
      console.error('Error reading reports from localStorage:', error);
      return [];
    }
  }

  private saveAllReports(reports: StoredReport[]): void {
    try {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    } catch (error) {
      console.error('Error saving reports to localStorage:', error);
      throw new Error('Failed to save report. Storage may be full.');
    }
  }


  public async createReport(reportData: CreateReportData): Promise<StoredReport> {
    const currentUser = this.getCurrentUser();
    const reportId = this.generateId();
    const now = new Date().toISOString();

    const report: StoredReport = {
      id: reportId,
      user_id: currentUser.id,
      title: reportData.title,
      date: reportData.date,
      content: reportData.content,
      created_at: now,
      updated_at: now
    };

    // Store audio if provided
    if (reportData.audio_blob) {
      try {
        // For now, we'll store audio info but not the actual blob due to localStorage size limits
        // In Phase 4, this will be sent to transcription API instead
        report.has_audio = true;
        report.audio_blob_key = `${AUDIO_KEY_PREFIX}${reportId}`;
        
        // Store a reference to the audio (in real implementation, would upload to server)
        console.log('Audio blob stored for report:', reportId, {
          size: reportData.audio_blob.size,
          duration: reportData.audio_duration
        });
      } catch (error) {
        console.warn('Failed to store audio, saving report without audio:', error);
      }
    }

    // Get all reports and add the new one
    const allReports = this.getAllReports();
    allReports.push(report);
    this.saveAllReports(allReports);

    return report;
  }

  public getReportById(reportId: string): StoredReport | null {
    const allReports = this.getAllReports();
    return allReports.find(report => report.id === reportId) || null;
  }

  public getReportsByUser(userId?: string): StoredReport[] {
    const currentUser = this.getCurrentUser();
    const targetUserId = userId || currentUser.id;
    
    const allReports = this.getAllReports();
    return allReports
      .filter(report => report.user_id === targetUserId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getReportsByDate(date: string, userId?: string): StoredReport[] {
    const currentUser = this.getCurrentUser();
    const targetUserId = userId || currentUser.id;
    
    const allReports = this.getAllReports();
    return allReports
      .filter(report => 
        report.user_id === targetUserId && 
        report.date === date
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getAllReportsForCurrentUser(): StoredReport[] {
    return this.getReportsByUser();
  }

  public updateReport(reportId: string, updates: Partial<CreateReportData>): StoredReport {
    const allReports = this.getAllReports();
    const reportIndex = allReports.findIndex(report => report.id === reportId);
    
    if (reportIndex === -1) {
      throw new Error('Report not found');
    }

    const currentUser = this.getCurrentUser();
    const existingReport = allReports[reportIndex];
    
    // Verify ownership
    if (existingReport.user_id !== currentUser.id) {
      throw new Error('Not authorized to update this report');
    }

    // Apply updates
    const updatedReport: StoredReport = {
      ...existingReport,
      ...updates,
      updated_at: new Date().toISOString()
    };

    allReports[reportIndex] = updatedReport;
    this.saveAllReports(allReports);

    return updatedReport;
  }

  public deleteReport(reportId: string): boolean {
    const allReports = this.getAllReports();
    const reportIndex = allReports.findIndex(report => report.id === reportId);
    
    if (reportIndex === -1) {
      return false;
    }

    const currentUser = this.getCurrentUser();
    const reportToDelete = allReports[reportIndex];
    
    // Verify ownership
    if (reportToDelete.user_id !== currentUser.id) {
      throw new Error('Not authorized to delete this report');
    }

    // Remove audio data if it exists
    if (reportToDelete.audio_blob_key) {
      try {
        localStorage.removeItem(reportToDelete.audio_blob_key);
      } catch (error) {
        console.warn('Failed to remove audio data:', error);
      }
    }

    // Remove report
    allReports.splice(reportIndex, 1);
    this.saveAllReports(allReports);

    return true;
  }

  public getStorageStats(): {
    totalReports: number;
    currentUserReports: number;
    storageUsed: string;
  } {
    const allReports = this.getAllReports();
    const currentUserReports = this.getReportsByUser();
    
    // Calculate approximate storage usage
    let storageUsed = 0;
    try {
      for (const key in localStorage) {
        if (key.startsWith('lastnext24_')) {
          storageUsed += localStorage[key].length;
        }
      }
    } catch (error) {
      console.warn('Could not calculate storage usage:', error);
    }

    return {
      totalReports: allReports.length,
      currentUserReports: currentUserReports.length,
      storageUsed: `${Math.round(storageUsed / 1024)} KB`
    };
  }

  public clearAllData(): void {
    try {
      // Remove all lastnext24 data from localStorage
      const keysToRemove: string[] = [];
      for (const key in localStorage) {
        if (key.startsWith('lastnext24_')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log('All report data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

// Export singleton instance
export const reportStorage = ReportStorageService.getInstance();