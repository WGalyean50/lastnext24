import OpenAI from 'openai';

// Initialize OpenAI client with error handling
export const createOpenAIClient = (): OpenAI => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  return new OpenAI({
    apiKey,
  });
};

// Error types for OpenAI operations
export class OpenAIError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'OpenAIError';
  }
}

export class TranscriptionError extends OpenAIError {
  constructor(message: string, originalError?: unknown) {
    super(message, originalError);
    this.name = 'TranscriptionError';
  }
}

export class SummarizationError extends OpenAIError {
  constructor(message: string, originalError?: unknown) {
    super(message, originalError);
    this.name = 'SummarizationError';
  }
}

// Helper function to handle OpenAI API errors
export const handleOpenAIError = (error: unknown, operation: string): never => {
  if (error instanceof OpenAI.APIError) {
    throw new OpenAIError(
      `OpenAI API error during ${operation}: ${error.message}`,
      error
    );
  }
  
  if (error instanceof Error) {
    throw new OpenAIError(
      `Error during ${operation}: ${error.message}`,
      error
    );
  }
  
  throw new OpenAIError(
    `Unknown error during ${operation}`,
    error
  );
};