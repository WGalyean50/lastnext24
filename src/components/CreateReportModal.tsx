import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import VoiceRecorder from './VoiceRecorder';
import { TranscriptionService } from '../services/transcriptionService';

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportData: {
    title?: string;
    content: string;
    date: string;
    audio_blob?: Blob;
    audio_duration?: number;
  }) => void;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative;
  
  @media (max-width: 768px) {
    width: 95%;
    max-height: 85vh;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem 1rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  
  @media (max-width: 768px) {
    padding: 1.25rem 1.5rem 0.75rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 1rem 0.75rem 1rem;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.125rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background: #f1f5f9;
    color: #475569;
  }
  
  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem 2rem 2rem 2rem;
  
  @media (max-width: 768px) {
    padding: 1.25rem 1.5rem 1.5rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 1rem 1.25rem 1rem;
  }
`;

const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
  
  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: 0.5rem;
    
    button {
      width: 100%;
      justify-content: center;
    }
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: #3b82f6;
    color: white;
    border: none;
    
    &:hover {
      background: #2563eb;
    }
    
    &:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
    
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  ` : `
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }
    
    &:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
  `}
`;

const AudioSection = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  
  @media (max-width: 480px) {
    margin: 0.75rem 0;
    padding: 0.75rem;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
`;

const AudioStatus = styled.div<{ variant?: 'success' | 'loading' | 'error' }>`
  margin-top: 0.75rem;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  text-align: center;
  
  ${props => {
    switch (props.variant) {
      case 'loading':
        return `
          background: #fef3c7;
          border: 1px solid #f59e0b;
          color: #92400e;
        `;
      case 'error':
        return `
          background: #fef2f2;
          border: 1px solid #fca5a5;
          color: #991b1b;
        `;
      case 'success':
      default:
        return `
          background: #ecfccb;
          border: 1px solid #bef264;
          color: #365314;
        `;
    }
  }}
`;

const loadingDotsAnimation = keyframes`
  0%, 20% { content: ''; }
  40% { content: '.'; }
  60% { content: '..'; }
  80%, 100% { content: '...'; }
`;

const LoadingDots = styled.span`
  &::after {
    content: '';
    animation: ${loadingDotsAnimation} 1.5s infinite;
  }
`;

const CreateReportModal: React.FC<CreateReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      // Set default date to today when modal opens
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      
      // Focus trap - prevent scrolling on background
      document.body.style.overflow = 'hidden';
    } else {
      // Reset form and restore scrolling
      setTitle('');
      setContent('');
      setDate('');
      setAudioBlob(null);
      setRecordingDuration(0);
      setIsTranscribing(false);
      setTranscriptionError('');
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const handleAudioRecorded = async (blob: Blob, duration: number) => {
    setAudioBlob(blob);
    setRecordingDuration(duration);
    setTranscriptionError('');
    
    // For now, skip transcription to avoid API errors during demo
    // Transcription will work once OpenAI API key is properly configured
    console.log('Audio recorded:', { duration, size: blob.size });
    console.log('Transcription available when OpenAI API key is configured');
    
    setIsTranscribing(true);
    
    try {
      const result = await TranscriptionService.transcribeAudio(blob);
      
      if (result.success && result.transcription) {
        const transcribedText = result.transcription.trim();
        if (transcribedText) {
          setContent(prevContent => {
            const existing = prevContent.trim();
            if (!existing) {
              return transcribedText;
            } else {
              return `${existing}\n\n[Voice recording]: ${transcribedText}`;
            }
          });
        }
      } else {
        setTranscriptionError(result.error || 'Failed to transcribe audio');
      }
    } catch (error) {
      console.error('Transcription failed:', error);
      setTranscriptionError('Transcription service unavailable (OpenAI API key not configured). Audio still recorded.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && !audioBlob) {
      alert('Please enter report content or record audio');
      return;
    }

    onSubmit({
      title: title.trim() || undefined,
      content: content.trim(),
      date,
      audio_blob: audioBlob || undefined,
      audio_duration: recordingDuration || undefined
    });
    
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay 
      isOpen={isOpen} 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <ModalContainer>
        <ModalHeader>
          <ModalTitle id="modal-title">Create New Report</ModalTitle>
          <CloseButton 
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            ×
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormField>
              <Label htmlFor="report-title">Report Title (Optional)</Label>
              <Input
                id="report-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your report..."
                maxLength={100}
              />
            </FormField>

            <FormField>
              <Label htmlFor="report-date">Date</Label>
              <Input
                id="report-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </FormField>

            <FormField>
              <Label htmlFor="report-content">Report Content</Label>
              <TextArea
                id="report-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What did you work on today? Share your progress, challenges, and plans..."
                rows={6}
              />
            </FormField>

            <AudioSection>
              <SectionTitle>Voice Recording (Optional)</SectionTitle>
              <VoiceRecorder 
                onAudioRecorded={handleAudioRecorded}
              />
              {isTranscribing && (
                <AudioStatus variant="loading">
                  🎤 Transcribing audio<LoadingDots />
                </AudioStatus>
              )}
              {transcriptionError && (
                <AudioStatus variant="error">
                  ❌ {transcriptionError}
                </AudioStatus>
              )}
              {audioBlob && !isTranscribing && !transcriptionError && (
                <AudioStatus variant="success">
                  ✓ Audio recorded ({recordingDuration}s) and transcribed - Ready to submit
                </AudioStatus>
              )}
            </AudioSection>

            <ButtonGroup>
              <Button type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={!content.trim() && !audioBlob}
              >
                Create Report
              </Button>
            </ButtonGroup>
          </form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CreateReportModal;