// Core data type definitions for LastNext24

/**
 * User represents a person in the organization hierarchy
 */
export interface User {
  id: string;
  name: string;
  role: UserRole;
  manager_id?: string; // null for top-level (CTO)
}

/**
 * Available user roles in the organization hierarchy
 */
export type UserRole = 'CTO' | 'VP' | 'Director' | 'Manager' | 'Engineer';

/**
 * Report represents a daily update from a user
 */
export interface Report {
  id: string;
  user_id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  content: string; // The actual report content
  summary?: string; // AI-generated summary (optional)
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}

/**
 * Project represents a work project/initiative
 */
export interface Project {
  id: string;
  name: string;
  team_id: string; // References the team/manager responsible
  description?: string;
}

/**
 * Aggregated report for managers combining team reports
 */
export interface AggregatedReport {
  id: string;
  manager_id: string;
  date: string; // ISO date string
  team_reports: Report[]; // Original reports from team members
  aggregated_content: string; // Combined/summarized content
  created_at: string;
}

/**
 * Chat message for the leadership chat interface
 */
export interface ChatMessage {
  id: string;
  content: string;
  response?: string;
  timestamp: string; // ISO datetime string
  user_role: UserRole;
}

/**
 * Audio recording data for voice reports
 */
export interface AudioRecording {
  id: string;
  blob: Blob;
  duration: number; // in seconds
  created_at: string;
}

/**
 * Session data for demo mode
 */
export interface SessionData {
  current_user_id: string;
  current_role: UserRole;
  session_start: string; // ISO datetime
}

// Utility types for API and form handling

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Report creation form data
 */
export interface CreateReportRequest {
  content?: string;
  audio_blob?: Blob;
  date?: string; // defaults to today
}

/**
 * Report update form data
 */
export interface UpdateReportRequest {
  content: string;
  date?: string;
}

/**
 * Transcription API request
 */
export interface TranscribeRequest {
  audio: Blob;
}

/**
 * Transcription API response
 */
export interface TranscribeResponse {
  text: string;
}

/**
 * Summarization API request
 */
export interface SummarizeRequest {
  text: string;
  context?: string; // additional context for better summarization
}

/**
 * Summarization API response
 */
export interface SummarizeResponse {
  summary: string;
}

/**
 * Chat API request
 */
export interface ChatRequest {
  query: string;
  user_role: UserRole;
  context_date?: string; // filter reports by date
}

/**
 * Chat API response
 */
export interface ChatResponse {
  response: string;
  sources?: string[]; // references to reports used
}