import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import { readFileSync } from 'fs';
import { createOpenAIClient, handleOpenAIError, TranscriptionError } from './lib/openai';

// Define the expected response format
interface TranscriptionResponse {
  success: boolean;
  transcription?: string;
  error?: string;
  duration?: number;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    } as TranscriptionResponse);
    return;
  }

  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      res.status(503).json({
        success: false,
        error: 'Transcription service unavailable: OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.'
      } as TranscriptionResponse);
      return;
    }

    // Validate content type
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.startsWith('multipart/form-data')) {
      res.status(400).json({
        success: false,
        error: 'Content-Type must be multipart/form-data'
      } as TranscriptionResponse);
      return;
    }

    // Parse the audio file from the request
    const audioFile = await parseAudioFile(req);
    if (!audioFile) {
      res.status(400).json({
        success: false,
        error: 'No audio file provided'
      } as TranscriptionResponse);
      return;
    }

    // Check if the audio file has content
    if (audioFile.size === 0) {
      res.status(400).json({
        success: false,
        error: 'Audio file is empty. Please record some audio before submitting.'
      } as TranscriptionResponse);
      return;
    }

    // Create OpenAI client
    const openai = createOpenAIClient();

    // Record start time for duration tracking
    const startTime = Date.now();

    // Create transcription using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en', // Specify English for better accuracy
      response_format: 'text',
    });

    const duration = Date.now() - startTime;

    // Return successful response
    res.status(200).json({
      success: true,
      transcription: transcription,
      duration
    } as TranscriptionResponse);

  } catch (error) {
    console.error('Transcription error:', error);
    
    try {
      handleOpenAIError(error, 'transcription');
    } catch (handledError) {
      if (handledError instanceof TranscriptionError) {
        res.status(500).json({
          success: false,
          error: handledError.message
        } as TranscriptionResponse);
        return;
      }
    }

    // Fallback error response
    res.status(500).json({
      success: false,
      error: 'Internal server error during transcription'
    } as TranscriptionResponse);
  }
}

// Helper function to parse audio file from multipart form data
async function parseAudioFile(req: VercelRequest): Promise<File | null> {
  try {
    const form = formidable({
      maxFileSize: 25 * 1024 * 1024, // 25MB max file size (OpenAI Whisper limit)
      multiples: false,
    });

    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Formidable parse error:', err);
          resolve(null);
          return;
        }

        // Find the audio file in the uploaded files
        const audioFile = files.audio;
        if (!audioFile) {
          console.error('No audio file found in request');
          resolve(null);
          return;
        }

        try {
          // Handle both single file and array of files
          const file = Array.isArray(audioFile) ? audioFile[0] : audioFile;
          
          if (!file || !file.filepath) {
            console.error('Invalid file object');
            resolve(null);
            return;
          }

          // Read the file data
          const fileBuffer = readFileSync(file.filepath);
          
          // Determine the MIME type based on the original filename or detected type
          let mimeType = file.mimetype || 'audio/webm';
          if (file.originalFilename) {
            const extension = file.originalFilename.split('.').pop()?.toLowerCase();
            switch (extension) {
              case 'webm':
                mimeType = 'audio/webm';
                break;
              case 'wav':
                mimeType = 'audio/wav';
                break;
              case 'mp3':
                mimeType = 'audio/mpeg';
                break;
              case 'm4a':
                mimeType = 'audio/m4a';
                break;
              case 'ogg':
                mimeType = 'audio/ogg';
                break;
            }
          }

          // Create a File-like object compatible with OpenAI API
          const fileObject = new File(
            [fileBuffer], 
            file.originalFilename || 'audio.webm',
            { type: mimeType }
          );
          
          resolve(fileObject);
        } catch (readError) {
          console.error('Error reading uploaded file:', readError);
          resolve(null);
        }
      });
    });
    
  } catch (error) {
    console.error('Error parsing audio file:', error);
    return null;
  }
}