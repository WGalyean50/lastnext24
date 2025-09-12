import React, { useState, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';

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
        return css`
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
  onTranscriptionReceived: _onTranscriptionReceived
}) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const dataRequestIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    if (dataRequestIntervalRef.current) {
      clearInterval(dataRequestIntervalRef.current);
      dataRequestIntervalRef.current = null;
    }
  }, []);

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    console.log('[VoiceRecorder] Starting recording process...');
    
    try {
      console.log('[VoiceRecorder] Setting state to requesting-permission');
      setRecordingState('requesting-permission');
      setErrorMessage('');
      audioChunksRef.current = [];
      setRecordingTime(0);

      // Check if we're in a secure context (HTTPS or localhost)
      if (!window.isSecureContext) {
        console.error('[VoiceRecorder] Not in secure context');
        throw new Error('Audio recording requires HTTPS or localhost');
      }

      // Check if MediaRecorder is supported
      console.log('[VoiceRecorder] Checking MediaRecorder support...');
      if (!window.MediaRecorder) {
        console.error('[VoiceRecorder] MediaRecorder not supported');
        throw new Error('MediaRecorder is not supported in this browser');
      }
      console.log('[VoiceRecorder] MediaRecorder is supported');

      // Check if getUserMedia is supported
      console.log('[VoiceRecorder] Checking getUserMedia support...');
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('[VoiceRecorder] getUserMedia not supported');
        throw new Error('Microphone access is not supported in this browser');
      }
      console.log('[VoiceRecorder] getUserMedia is supported');

      // Request microphone permission with Safari-optimized constraints
      console.log('[VoiceRecorder] Requesting microphone permission...');
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      console.log('[VoiceRecorder] Safari detected:', isSafari);
      
      const audioConstraints = isSafari ? {
        // Safari-optimized constraints
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        }
      } : {
        // Chrome/other browsers
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      };
      
      console.log('[VoiceRecorder] Audio constraints:', audioConstraints);
      const stream = await navigator.mediaDevices.getUserMedia(audioConstraints);
      console.log('[VoiceRecorder] Microphone permission granted, stream obtained');

      streamRef.current = stream;

      // Verify the audio stream is active and has audio tracks
      const audioTracks = stream.getAudioTracks();
      console.log('[VoiceRecorder] Audio tracks:', audioTracks.length);
      
      if (audioTracks.length === 0) {
        throw new Error('No audio tracks found in the stream');
      }
      
      const audioTrack = audioTracks[0];
      console.log('[VoiceRecorder] Audio track state:', audioTrack.readyState);
      console.log('[VoiceRecorder] Audio track enabled:', audioTrack.enabled);
      
      if (audioTrack.readyState === 'ended') {
        throw new Error('Audio track has ended unexpectedly');
      }

      // Check supported MIME types and use fallback if needed
      console.log('[VoiceRecorder] Checking MIME type support...');
      let detectedMimeType = '';
      let options = {};
      
      // Safari-specific MIME type handling
      const mimeTypes = isSafari ? [
        'audio/mp4',
        'audio/wav',
        ''
      ] : [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        ''
      ];
      
      for (const type of mimeTypes) {
        if (!type || MediaRecorder.isTypeSupported(type)) {
          detectedMimeType = type;
          console.log('[VoiceRecorder] Using MIME type:', detectedMimeType || 'browser default');
          break;
        }
        console.log('[VoiceRecorder] MIME type not supported:', type);
      }
      
      if (detectedMimeType) {
        options = { mimeType: detectedMimeType };
      }
      
      // Safari-specific options
      if (isSafari && detectedMimeType === 'audio/mp4') {
        options = { mimeType: 'audio/mp4;codecs=mp4a.40.2' };
        console.log('[VoiceRecorder] Using Safari-specific MP4 codec');
      }

      // Create MediaRecorder
      console.log('[VoiceRecorder] Creating MediaRecorder with options:', options);
      const mediaRecorder = new MediaRecorder(stream, options);
      console.log('[VoiceRecorder] MediaRecorder created successfully');

      mediaRecorderRef.current = mediaRecorder;

      // Set up event handlers
      console.log('[VoiceRecorder] Setting up MediaRecorder event handlers...');
      mediaRecorder.ondataavailable = (event) => {
        console.log('[VoiceRecorder] Data available:', event.data.size, 'bytes', 'type:', event.data.type);
        console.log('[VoiceRecorder] Event details:', {
          size: event.data.size,
          type: event.data.type,
          timecode: event.timecode
        });
        
        // Always push data, even if empty, to see what we're getting
        audioChunksRef.current.push(event.data);
        if (event.data && event.data.size > 0) {
          console.log('[VoiceRecorder] Adding valid chunk to audioChunks array');
        } else {
          console.warn('[VoiceRecorder] Received empty chunk - checking if data exists in other form');
          // Try to check if there's data in the blob despite size=0
          if (event.data instanceof Blob) {
            console.log('[VoiceRecorder] Blob details:', {
              size: event.data.size,
              type: event.data.type,
              constructor: event.data.constructor.name
            });
          }
        }
      };

      mediaRecorder.onstop = () => {
        console.log('[VoiceRecorder] Recording stopped, processing audio...');
        console.log('[VoiceRecorder] Number of audio chunks:', audioChunksRef.current.length);
        
        if (audioChunksRef.current.length === 0) {
          console.error('[VoiceRecorder] No audio chunks were recorded!');
          setErrorMessage('No audio data was captured. Please check your microphone and try again.');
          setRecordingState('error');
          cleanupStream();
          return;
        }
        
        // Log each chunk for debugging
        audioChunksRef.current.forEach((chunk, index) => {
          console.log(`[VoiceRecorder] Chunk ${index}: size=${chunk.size}, type=${chunk.type}`);
        });
        
        const audioBlob = new Blob(audioChunksRef.current, { type: detectedMimeType || 'audio/webm' });
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        console.log('[VoiceRecorder] Audio blob created:', { size: audioBlob.size, duration, type: audioBlob.type });
        
        if (audioBlob.size === 0) {
          console.error('[VoiceRecorder] Audio blob is empty!');
          setErrorMessage('Recording failed - no audio data captured. Please try again.');
          setRecordingState('error');
          cleanupStream();
          return;
        }
        
        onAudioRecorded(audioBlob, duration);
        cleanupStream();
        setRecordingState('idle');
        setRecordingTime(0);
      };

      mediaRecorder.onerror = (event) => {
        console.error('[VoiceRecorder] MediaRecorder error:', event);
        setErrorMessage('Recording failed. Please try again.');
        setRecordingState('error');
        cleanupStream();
      };

      // Start recording
      console.log('[VoiceRecorder] Starting MediaRecorder...');
      if (isSafari) {
        // For Safari, use intervals to request data periodically
        mediaRecorder.start();
        console.log('[VoiceRecorder] Safari: Starting with periodic data requests');
        dataRequestIntervalRef.current = setInterval(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            console.log('[VoiceRecorder] Safari: Requesting data...');
            mediaRecorderRef.current.requestData();
          }
        }, 1000);
      } else {
        // For other browsers, use time slices
        mediaRecorder.start(1000);
        console.log('[VoiceRecorder] Non-Safari: Starting with 1000ms time slices');
      }
      
      console.log('[VoiceRecorder] MediaRecorder started, setting state to recording');
      setRecordingState('recording');
      startTimer();
      console.log('[VoiceRecorder] Recording process completed successfully');

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
      console.log('[VoiceRecorder] Stopping recording...');
      
      // Check if recording time is sufficient
      const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      console.log('[VoiceRecorder] Recording duration:', elapsedTime, 'seconds');
      
      if (elapsedTime < 1) {
        console.warn('[VoiceRecorder] Recording too short, extending to 1 second...');
        // Don't stop yet, let it record for at least 1 second
        setTimeout(() => {
          if (mediaRecorderRef.current && recordingState === 'recording') {
            console.log('[VoiceRecorder] Now stopping after minimum duration');
            setRecordingState('stopping');
            stopTimer();
            mediaRecorderRef.current.stop();
          }
        }, 1000 - (Date.now() - startTimeRef.current));
        return;
      }
      
      setRecordingState('stopping');
      stopTimer();
      
      // Request any remaining data before stopping
      if (mediaRecorderRef.current.state === 'recording') {
        console.log('[VoiceRecorder] Requesting final data before stop...');
        mediaRecorderRef.current.requestData();
      }
      
      mediaRecorderRef.current.stop();
    }
  }, [recordingState, stopTimer]);

  const handleButtonClick = () => {
    console.log('[VoiceRecorder] Button clicked, current state:', recordingState);
    
    try {
      if (recordingState === 'idle' || recordingState === 'error') {
        console.log('[VoiceRecorder] Starting recording...');
        startRecording();
      } else if (recordingState === 'recording') {
        console.log('[VoiceRecorder] Stopping recording...');
        stopRecording();
      }
    } catch (error) {
      console.error('[VoiceRecorder] Error in handleButtonClick:', error);
      setErrorMessage('Failed to start recording: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setRecordingState('error');
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

  // Cleanup on unmount and error handling
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('[VoiceRecorder] Window error:', event.error);
      if (event.error && event.error.message && event.error.message.includes('recording')) {
        console.error('[VoiceRecorder] Recording-related error caught');
        setErrorMessage('Recording error: ' + event.error.message);
        setRecordingState('error');
        cleanupStream();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('[VoiceRecorder] Unhandled promise rejection:', event.reason);
      if (event.reason && event.reason.toString().includes('recording')) {
        console.error('[VoiceRecorder] Recording-related promise rejection caught');
        setErrorMessage('Recording error: ' + event.reason.toString());
        setRecordingState('error');
        cleanupStream();
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      stopTimer();
      cleanupStream();
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
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