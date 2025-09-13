import { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  AlertCircle,
  Volume2,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useAudioRecording } from '../hooks/useAudioRecording';

interface AudioRecorderProps {
  onTranscriptChange: (transcript: string) => void;
  disabled?: boolean;
  className?: string;
  resetTrigger?: number;
}

export default function AudioRecorder({ onTranscriptChange, disabled = false, className = '', resetTrigger = 0 }: AudioRecorderProps) {
  const {
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
  } = useAudioRecording();

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Update parent component when transcript changes
  useEffect(() => {
    onTranscriptChange(transcript);
  }, [transcript, onTranscriptChange]);

  // Reset audio recorder when resetTrigger changes
  useEffect(() => {
    if (resetTrigger > 0) {
      handleClearAndRestart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTrigger]);

  // Create audio element when URL is available
  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);
      
      return () => {
        audio.pause();
        setAudioElement(null);
      };
    }
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const handleStartRecording = async () => {
    if (!permissionGranted) {
      await requestPermission();
    }
    await startRecording();
  };

  const handleClearAndRestart = () => {
    clearRecording();
    setIsPlaying(false);
    setAudioElement(null);
  };

  if (permissionError && !permissionGranted) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <div className="bg-red-100 p-3 rounded-lg w-fit mx-auto mb-4">
            <MicOff className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Microphone Access Required</h3>
          <p className="text-sm text-gray-600 mb-4">{permissionError}</p>
          <button
            onClick={requestPermission}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Mic className="h-4 w-4" />
            Grant Microphone Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Voice Response</h3>
        {audioUrl && (
          <button
            onClick={handleClearAndRestart}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <RotateCcw className="h-4 w-4" />
            Clear & Restart
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-800">{error}</p>
            <p className="text-xs text-red-600 mt-1">
              You can continue using text input if audio recording isn't working.
            </p>
          </div>
        </div>
      )}

      {!audioUrl ? (
        // Recording State
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center transition-all ${
            isRecording 
              ? 'bg-red-100 animate-pulse' 
              : 'bg-blue-100 hover:bg-blue-200 cursor-pointer'
          }`}>
            {isRecording ? (
              <Square className="h-8 w-8 text-red-600" />
            ) : (
              <Mic className="h-8 w-8 text-blue-600" />
            )}
          </div>
          
          <div className="space-y-3">
            {isRecording ? (
              <>
                <p className="text-lg font-medium text-gray-900">Recording...</p>
                <p className="text-sm text-gray-600">Tap the stop button when finished</p>
                <button
                  onClick={stopRecording}
                  disabled={disabled}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Square className="h-4 w-4" />
                  Stop Recording
                </button>
              </>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-900">Ready to Record</p>
                <p className="text-sm text-gray-600">Tap the microphone to start recording your answer</p>
                <button
                  onClick={handleStartRecording}
                  disabled={disabled}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Mic className="h-4 w-4" />
                  Start Recording
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        // Playback and Transcription State
        <div className="space-y-4">
          {/* Audio Playback Controls */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {isPlaying ? 'Playing recording...' : 'Recorded answer ready'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transcription Status */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-sm font-medium text-gray-900">Transcription</h4>
              {isTranscribing ? (
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              ) : transcript ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : null}
            </div>
            
            {isTranscribing ? (
              <div className="text-center py-4">
                <div className="animate-pulse">
                  <div className="h-2 bg-blue-200 rounded-full w-3/4 mx-auto mb-2"></div>
                  <div className="h-2 bg-blue-200 rounded-full w-1/2 mx-auto"></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Converting speech to text...</p>
              </div>
            ) : transcript ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 leading-relaxed">{transcript}</p>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    This transcription will be used as your answer. You can re-record if needed.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Transcription will appear here...</p>
            )}
          </div>
        </div>
      )}

      {/* Usage Tips */}
      {!audioUrl && !isRecording && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            💡 Tip: Speak clearly and ensure you're in a quiet environment for best transcription results
          </p>
        </div>
      )}
    </div>
  );
}