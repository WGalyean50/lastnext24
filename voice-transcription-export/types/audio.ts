// TypeScript definitions for audio recording and transcription

export interface AudioRecordingHook {
  isRecording: boolean;
  audioUrl: string | null;
  transcript: string;
  isTranscribing: boolean;
  error: string | null;
  permissionGranted: boolean;
  permissionError: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearRecording: () => void;
  requestPermission: () => Promise<void>;
}

export interface AudioRecorderProps {
  onTranscriptChange: (transcript: string) => void;
  disabled?: boolean;
  className?: string;
  resetTrigger?: number;
}

export interface TranscriptionApiResponse {
  success: boolean;
  transcript?: string;
  error?: string;
  details?: string;
  service?: string;
  audioSize?: number;
  timestamp?: string;
}

export interface TranscriptionApiRequest {
  audioData: string; // base64 encoded audio
  mimeType: string;
}

// Browser MediaRecorder types extension
declare global {
  interface MediaRecorderConstructor {
    isTypeSupported(mimeType: string): boolean;
  }
}

// Audio constraints for getUserMedia
export interface AudioConstraints {
  echoCancellation: boolean;
  noiseSuppression: boolean;
  sampleRate: number;
}