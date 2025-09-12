import React, { useState, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

interface VoiceRecorderProps {
  onAudioRecorded: (audioBlob: Blob, duration: number) => void;
  onTranscriptionReceived?: (transcription: string) => void;
}

type RecordingState = 'idle' | 'requesting-permission' | 'recording' | 'stopping' | 'error';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const RecorderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    gap: 0.75rem;
  }
`;

const RecordButton = styled.button<{ 
  $state: RecordingState;
  $isRecording: boolean;
}>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  
  ${props => {
    switch (props.$state) {
      case 'idle':
        return `
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
          &:hover {
            background: #2563eb;
            border-color: #2563eb;
            transform: scale(1.05);
          }
        `;
      case 'requesting-permission':
        return `
          background: #f59e0b;
          border-color: #f59e0b;
          color: white;
          cursor: wait;
        `;
      case 'recording':
        return `
          background: #ef4444;
          border-color: #ef4444;
          color: white;
          animation: ${pulse} 1.5s ease-in-out infinite;
        `;
      case 'stopping':
        return `
          background: #6b7280;
          border-color: #6b7280;
          color: white;
          cursor: wait;
        `;
      case 'error':
        return `
          background: #ef4444;
          border-color: #ef4444;
          color: white;
        `;
      default:
        return `
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        `;
    }
  }}
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

const StatusText = styled.div<{ $state: RecordingState }>`
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  min-height: 1.25rem;
  
  ${props => {
    switch (props.$state) {
      case 'idle':
        return 'color: #64748b;';
      case 'requesting-permission':
        return 'color: #f59e0b;';
      case 'recording':
        return 'color: #ef4444;';
      case 'stopping':
        return 'color: #6b7280;';
      case 'error':
        return 'color: #ef4444;';
      default:
        return 'color: #64748b;';
    }
  }}
`;

const Timer = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  min-height: 1.5rem;
  font-family: monospace;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
  max-width: 280px;
`;

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onAudioRecorded,
  onTranscriptionReceived
}) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setRecordingTime(elapsed);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setRecordingState('requesting-permission');
      setErrorMessage('');
      audioChunksRef.current = [];
      setRecordingTime(0);

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      streamRef.current = stream;

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        
        onAudioRecorded(audioBlob, duration);
        cleanupStream();
        setRecordingState('idle');
        setRecordingTime(0);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setErrorMessage('Recording failed. Please try again.');
        setRecordingState('error');
        cleanupStream();
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setRecordingState('recording');
      startTimer();

    } catch (error) {
      console.error('Error starting recording:', error);
      
      let errorMsg = 'Failed to start recording.';
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMsg = 'Microphone permission denied. Please allow microphone access and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMsg = 'No microphone found. Please connect a microphone and try again.';
        } else if (error.name === 'NotSupportedError') {
          errorMsg = 'Audio recording is not supported in this browser.';
        }
      }
      
      setErrorMessage(errorMsg);
      setRecordingState('error');
      cleanupStream();
    }
  }, [onAudioRecorded, cleanupStream, startTimer]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      setRecordingState('stopping');
      stopTimer();
      mediaRecorderRef.current.stop();
    }
  }, [recordingState, stopTimer]);

  const handleButtonClick = () => {
    if (recordingState === 'idle' || recordingState === 'error') {
      startRecording();
    } else if (recordingState === 'recording') {
      stopRecording();
    }
  };

  const getButtonIcon = (): string => {
    switch (recordingState) {
      case 'idle':
      case 'error':
        return '🎤';
      case 'requesting-permission':
        return '⏳';
      case 'recording':
        return '⏹️';
      case 'stopping':
        return '⏳';
      default:
        return '🎤';
    }
  };

  const getStatusText = (): string => {
    switch (recordingState) {
      case 'idle':
        return 'Click to start recording';
      case 'requesting-permission':
        return 'Requesting microphone access...';
      case 'recording':
        return 'Recording... Click to stop';
      case 'stopping':
        return 'Stopping recording...';
      case 'error':
        return 'Click to try again';
      default:
        return '';
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopTimer();
      cleanupStream();
    };
  }, [stopTimer, cleanupStream]);

  return (
    <RecorderContainer>
      <RecordButton
        onClick={handleButtonClick}
        disabled={recordingState === 'requesting-permission' || recordingState === 'stopping'}
        $state={recordingState}
        $isRecording={recordingState === 'recording'}
        aria-label={recordingState === 'recording' ? 'Stop recording' : 'Start recording'}
      >
        {getButtonIcon()}
      </RecordButton>
      
      <StatusText $state={recordingState}>
        {getStatusText()}
      </StatusText>
      
      {recordingState === 'recording' && (
        <Timer>
          {formatTime(recordingTime)}
        </Timer>
      )}
      
      {errorMessage && (
        <ErrorMessage>
          {errorMessage}
        </ErrorMessage>
      )}
    </RecorderContainer>
  );
};

export default VoiceRecorder;