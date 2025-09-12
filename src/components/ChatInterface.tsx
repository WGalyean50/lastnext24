import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import type { UserRole } from '../types';

interface ChatMessage {
  id: string;
  query: string;
  response: string;
  timestamp: string;
  sources?: ReportSource[];
  isLoading?: boolean;
}

interface ReportSource {
  user_id: string;
  user_name: string;
  user_role: string;
  date: string;
  content_snippet: string;
  relevance_score: number;
}

interface ChatInterfaceProps {
  currentUserId?: string;
  currentUserRole: UserRole;
  selectedDate?: string;
}

const ChatContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 500px;
  
  @media (max-width: 1024px) {
    height: 400px;
  }
`;

const ChatHeader = styled.div`
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChatIcon = styled.span`
  font-size: 1.2rem;
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
`;

const MessagesList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1.5rem;
  min-height: 0;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UserMessage = styled.div`
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 12px 12px 4px 12px;
  align-self: flex-end;
  max-width: 80%;
  font-size: 0.875rem;
  line-height: 1.4;
`;

const AssistantMessage = styled.div`
  background: #f1f5f9;
  color: #374151;
  padding: 0.75rem 1rem;
  border-radius: 12px 12px 12px 4px;
  align-self: flex-start;
  max-width: 85%;
  font-size: 0.875rem;
  line-height: 1.4;
`;

const LoadingMessage = styled.div`
  background: #f1f5f9;
  color: #64748b;
  padding: 0.75rem 1rem;
  border-radius: 12px 12px 12px 4px;
  align-self: flex-start;
  max-width: 85%;
  font-size: 0.875rem;
  line-height: 1.4;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 2px;
  
  span {
    width: 4px;
    height: 4px;
    background: #64748b;
    border-radius: 50%;
    animation: pulse 1.4s ease-in-out infinite both;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0; }
  }
  
  @keyframes pulse {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

const SourcesContainer = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #fefefe;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.75rem;
`;

const SourcesTitle = styled.div`
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.5rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

const SourceItem = styled.div`
  padding: 0.25rem 0;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SourceInfo = styled.div`
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.15rem;
`;

const SourceSnippet = styled.div`
  color: #64748b;
  font-style: italic;
`;

const ChatInputContainer = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: white;
`;

const ChatInputForm = styled.form`
  display: flex;
  gap: 0.5rem;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const SendButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.875rem;
  min-width: 60px;
  
  &:hover:not(:disabled) {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #64748b;
  padding: 2rem 1rem;
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #374151;
    font-size: 1rem;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.4;
  }
`;

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentUserId,
  currentUserRole,
  selectedDate
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    const query = inputValue.trim();
    setInputValue('');
    setIsLoading(true);
    
    // Create user message
    const messageId = Date.now().toString();
    const userMessage: ChatMessage = {
      id: messageId,
      query,
      response: '',
      timestamp: new Date().toISOString(),
      isLoading: false
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Call chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          user_role: currentUserRole,
          user_id: currentUserId,
          context_date: selectedDate,
          max_sources: 3
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Update the message with the response
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, response: data.response, sources: data.sources }
            : msg
        ));
      } else {
        // Handle API error
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, response: `Error: ${data.error}` }
            : msg
        ));
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, response: 'Sorry, I encountered an error processing your request. Please try again.' }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const isLeadershipRole = ['Manager', 'Director', 'VP', 'CTO'].includes(currentUserRole);

  if (!isLeadershipRole) {
    return null; // Only show chat interface for leadership roles
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatIcon>💬</ChatIcon>
        Ask about Reports
      </ChatHeader>
      
      <ChatBody>
        <MessagesList>
          {messages.length === 0 ? (
            <EmptyState>
              <h3>AI Assistant</h3>
              <p>Ask questions about team reports, progress, and organizational insights. I can help you understand patterns, identify blockers, and get actionable information from your team's updates.</p>
            </EmptyState>
          ) : (
            messages.map((message) => (
              <MessageContainer key={message.id}>
                <UserMessage>{message.query}</UserMessage>
                {message.response ? (
                  <>
                    <AssistantMessage>{message.response}</AssistantMessage>
                    {message.sources && message.sources.length > 0 && (
                      <SourcesContainer>
                        <SourcesTitle>Sources from Reports</SourcesTitle>
                        {message.sources.map((source, index) => (
                          <SourceItem key={index}>
                            <SourceInfo>
                              {source.user_name} ({source.user_role}) - {new Date(source.date).toLocaleDateString()}
                            </SourceInfo>
                            <SourceSnippet>"{source.content_snippet}"</SourceSnippet>
                          </SourceItem>
                        ))}
                      </SourcesContainer>
                    )}
                  </>
                ) : (
                  <LoadingMessage>
                    Analyzing reports
                    <LoadingDots>
                      <span></span>
                      <span></span>
                      <span></span>
                    </LoadingDots>
                  </LoadingMessage>
                )}
              </MessageContainer>
            ))
          )}
          <div ref={messagesEndRef} />
        </MessagesList>
      </ChatBody>
      
      <ChatInputContainer>
        <ChatInputForm onSubmit={handleSubmit}>
          <ChatInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about team progress, blockers, trends..."
            disabled={isLoading}
          />
          <SendButton type="submit" disabled={isLoading || !inputValue.trim()}>
            {isLoading ? '...' : 'Send'}
          </SendButton>
        </ChatInputForm>
      </ChatInputContainer>
    </ChatContainer>
  );
};

export default ChatInterface;