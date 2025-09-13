import { useState, useRef, useCallback } from 'react';

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

export function useAudioRecording(): AudioRecordingHook {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const requestPermission = useCallback(async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      // Stop the stream immediately after getting permission
      stream.getTracks().forEach(track => track.stop());
      setPermissionGranted(true);
      
    } catch (err) {
      console.error('Error requesting microphone permission:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
        setPermissionError('Microphone access denied. Please allow microphone access in your browser settings.');
      } else if (errorMessage.includes('NotFoundError')) {
        setPermissionError('No microphone found. Please connect a microphone and try again.');
      } else {
        setPermissionError('Unable to access microphone. Please check your browser settings.');
      }
      setPermissionGranted(false);
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setTranscript('');
      
      if (!permissionGranted) {
        await requestPermission();
        if (!permissionGranted) return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];

      // Set up MediaRecorder for audio recording
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mediaRecorder.mimeType || 'audio/webm'
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Start Whisper transcription after recording stops
        await transcribeWithWhisper(audioBlob, mediaRecorder.mimeType || 'audio/webm');
        
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      // Start recording
      mediaRecorder.start(1000);
      setIsRecording(true);
      
    } catch (err) {
      console.error('Error starting recording:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to start recording: ${errorMessage}`);
      setIsRecording(false);
    }
  }, [permissionGranted, requestPermission]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const transcribeWithWhisper = async (audioBlob: Blob, mimeType: string) => {
    try {
      setIsTranscribing(true);
      setError(null);
      
      // Enhanced debug logging
      const DEBUG_MODE = import.meta.env.DEV || import.meta.env.VITE_DEBUG_AUDIO;
      
      if (DEBUG_MODE) {
        console.log('🎤 Audio Recording Details:', {
          size: audioBlob.size,
          sizeKB: (audioBlob.size / 1024).toFixed(2) + ' KB',
          sizeMB: (audioBlob.size / (1024 * 1024)).toFixed(2) + ' MB',
          type: audioBlob.type,
          mimeType: mimeType,
          duration: 'Check browser console for playback'
        });
      }
      
      // Validate audio size before processing
      if (audioBlob.size < 1000) {
        throw new Error('Audio recording too short. Please record for at least 1 second.');
      }
      
      if (audioBlob.size > 25 * 1024 * 1024) {
        throw new Error('Audio recording too large (>25MB). Please record a shorter message.');
      }
      
      console.log('Starting OpenAI Whisper transcription...', (audioBlob.size / 1024).toFixed(2), 'KB');
      
      // Convert audio blob to base64
      const reader = new FileReader();
      const audioDataBase64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data URL prefix to get just base64 data
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      // Try external API first (if configured)
      const externalApiUrl = import.meta.env.VITE_EXTERNAL_TRANSCRIPTION_API;
      const bypassToken = import.meta.env.VITE_VERCEL_BYPASS_TOKEN;
      
      if (externalApiUrl) {
        // Build URL with bypass token if provided
        let apiUrl = `${externalApiUrl}/transcribe`;
        if (bypassToken) {
          apiUrl = `${externalApiUrl}/transcribe?x-vercel-protection-bypass=${bypassToken}`;
          console.log('Using external transcription API with bypass token');
        } else {
          console.log('Using external transcription API:', externalApiUrl);
        }
        
        if (DEBUG_MODE) {
          console.log('📡 API Request Details:', {
            url: apiUrl,
            method: 'POST',
            bodySize: audioDataBase64.length,
            mimeType: mimeType,
            hasToken: !!bypassToken
          });
        }
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audioData: audioDataBase64,
            mimeType: mimeType
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: response.statusText }));
          console.error('External API response error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
          });
          throw new Error(`External API Error (${response.status}): ${errorData.error || errorData.details || response.statusText}`);
        }
        
        const result = await response.json();
        
        if (DEBUG_MODE) {
          console.log('📥 API Response:', {
            success: result.success,
            hasTranscript: !!result.transcript,
            transcriptLength: result.transcript?.length,
            audioSize: result.audioSize,
            service: result.service
          });
        }
        
        if (result.success && result.transcript) {
          setTranscript(result.transcript);
          console.log('✅ OpenAI Whisper transcription successful:', result.transcript.substring(0, 100) + '...');
          return;
        } else {
          throw new Error(result.error || result.details || 'No transcript received from external API');
        }
      }
      
      // Fallback to Vercel function (will likely fail)
      console.log('External API not configured, trying Vercel function...');
      const response = await fetch('/api/transcribe-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioData: audioDataBase64,
          mimeType: mimeType
        })
      });
      
      if (!response.ok) {
        throw new Error(`Vercel API Error (${response.status}): Serverless functions are experiencing deployment issues.`);
      }
      
      const result = await response.json();
      
      if (result.success && result.transcript) {
        setTranscript(result.transcript);
        console.log('Transcription successful:', result.transcript.substring(0, 100) + '...');
      } else {
        throw new Error('No transcript received from API');
      }
      
    } catch (error) {
      console.error('Transcription error:', error);
      let errorMessage = 'Unknown error';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Provide user-friendly fallback message with setup instructions
      const fallbackMessage = `Audio recording completed successfully! 

⚠️ OpenAI Whisper transcription failed. 

To enable transcription:
1. Deploy the external API (see external-api/README.md)
2. Set VITE_EXTERNAL_TRANSCRIPTION_API environment variable
3. Or fix Vercel serverless function deployment issues

Your audio was recorded and can be played back above. For now, please provide your answer using the text input below.

Error: ${errorMessage}`;

      setError(`Transcription failed: ${errorMessage}`);
      setTranscript(fallbackMessage);
    } finally {
      setIsTranscribing(false);
    }
  };



  const clearRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setTranscript('');
    setError(null);
    setIsTranscribing(false);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, [audioUrl]);

  return {
    isRecording,
    audioUrl,
    transcript,
    isTranscribing,
    error,
    permissionGranted,
    permissionError,
    startRecording,
    stopRecording,
    clearRecording,
    requestPermission
  };
}