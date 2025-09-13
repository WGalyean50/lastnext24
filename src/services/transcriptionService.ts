// Service for handling audio transcription using OpenAI API

export interface TranscriptionResponse {
  success: boolean;
  transcription?: string;
  error?: string;
  duration?: number;
}

export interface SummaryRequest {
  reports: string[];
  context?: string;
  summaryType?: 'individual' | 'aggregate' | 'executive';
  maxLength?: number;
}

export interface SummaryResponse {
  success: boolean;
  summary?: string;
  individualSummaries?: string[];
  error?: string;
  processingTime?: number;
  tokenCount?: number;
}

export class TranscriptionService {
  private static readonly API_BASE = '/api';
  
  /**
   * Transcribe audio blob using OpenAI Whisper API
   */
  static async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResponse> {
    try {
      // Create FormData to send the audio file
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      // Make the API request - temporarily use demo endpoint while OpenAI API key is being configured
      const response = await fetch(`${this.API_BASE}/transcribe-demo`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `HTTP error! status: ${response.status}`
        };
      }
      
      const result: TranscriptionResponse = await response.json();
      return result;
      
    } catch (error) {
      console.error('Transcription service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error during transcription'
      };
    }
  }
  
  /**
   * Summarize reports using OpenAI GPT-4o API
   */
  static async summarizeReports(request: SummaryRequest): Promise<SummaryResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `HTTP error! status: ${response.status}`
        };
      }
      
      const result: SummaryResponse = await response.json();
      return result;
      
    } catch (error) {
      console.error('Summarization service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error during summarization'
      };
    }
  }
  
  /**
   * Check if the transcription API is available
   */
  static async checkAPIHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/transcribe`, {
        method: 'OPTIONS',
      });
      return response.ok;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
}