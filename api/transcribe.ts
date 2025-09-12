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
    
    console.log('Calling OpenAI Whisper API with:', {
      fileSize: audioFile.size,
      fileName: audioFile.name,
      fileType: audioFile.type,
      model: 'whisper-1'
    });

    // Create transcription using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en', // Specify English for better accuracy
      response_format: 'text',
    });

    const duration = Date.now() - startTime;
    console.log('OpenAI Whisper API successful:', {
      transcriptionLength: transcription.length,
      duration: `${duration}ms`
    });

    // Return successful response
    res.status(200).json({
      success: true,
      transcription: transcription,
      duration
    } as TranscriptionResponse);

  } catch (error) {
    console.error('Transcription error details:', error);
    
    // Log more specific error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check if it's an OpenAI specific error
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('OpenAI error code:', (error as any).code);
      console.error('OpenAI error type:', (error as any).type);
    }
    
    try {
      handleOpenAIError(error, 'transcription');
    } catch (handledError) {
      console.error('Handled error:', handledError.message);
      if (handledError instanceof TranscriptionError) {
        res.status(500).json({
          success: false,
          error: handledError.message
        } as TranscriptionResponse);
        return;
      }
    }

    // Fallback error response with more details
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      error: `Transcription failed: ${errorMessage}`
    } as TranscriptionResponse);
  }
}

// Helper function to parse audio file from multipart form data
async function parseAudioFile(req: VercelRequest): Promise<File | null> {
  try {
    console.log('Starting form parsing...');
    const form = formidable({
      maxFileSize: 25 * 1024 * 1024, // 25MB max file size (OpenAI Whisper limit)
      multiples: false,
      keepExtensions: true, // Keep original file extensions
      allowEmptyFiles: false, // Don't allow empty files
    });

    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        console.log('Form parsing completed');
        console.log('Fields:', Object.keys(fields || {}));
        console.log('Files:', Object.keys(files || {}));
        
        if (err) {
          console.error('Formidable parse error:', err);
          console.error('Error type:', err.name);
          console.error('Error message:', err.message);
          resolve(null);
          return;
        }

        // Find the audio file in the uploaded files
        const audioFile = files.audio;
        if (!audioFile) {
          console.error('No audio file found in request');
          console.error('Available files:', Object.keys(files || {}));
          resolve(null);
          return;
        }
        
        console.log('Audio file found:', audioFile);

        try {
          // Handle both single file and array of files
          const file = Array.isArray(audioFile) ? audioFile[0] : audioFile;
          console.log('Processing file:', {
            isArray: Array.isArray(audioFile),
            hasFilepath: !!(file && file.filepath),
            originalFilename: file?.originalFilename,
            mimetype: file?.mimetype,
            size: file?.size
          });
          
          if (!file || !file.filepath) {
            console.error('Invalid file object - missing filepath');
            console.error('File object:', file);
            resolve(null);
            return;
          }

          console.log('Reading file from path:', file.filepath);
          // Read the file data
          const fileBuffer = readFileSync(file.filepath);
          console.log('File buffer read successfully, size:', fileBuffer.length);
          
          // Determine the MIME type and clean it for OpenAI compatibility
          let mimeType = file.mimetype || 'audio/webm';
          console.log('Original MIME type:', mimeType);
          
          // Clean up Safari-specific codec info that might confuse OpenAI
          if (mimeType.includes('audio/mp4')) {
            mimeType = 'audio/mp4';
            console.log('Cleaned MP4 MIME type for OpenAI compatibility');
          }
          
          if (file.originalFilename) {
            const extension = file.originalFilename.split('.').pop()?.toLowerCase();
            console.log('File extension:', extension);
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
              case 'mp4':
                mimeType = 'audio/mp4';
                break;
              case 'ogg':
                mimeType = 'audio/ogg';
                break;
            }
          }
          
          console.log('Final MIME type for OpenAI:', mimeType);

          // Create a File-like object compatible with OpenAI API
          console.log('Creating File object with:', {
            bufferSize: fileBuffer.length,
            filename: file.originalFilename || 'audio.mp4',
            mimeType
          });
          
          const fileObject = new File(
            [fileBuffer], 
            file.originalFilename || 'audio.mp4', // Default to mp4 for Safari
            { type: mimeType }
          );
          
          console.log('File object created successfully:', {
            size: fileObject.size,
            name: fileObject.name,
            type: fileObject.type
          });
          
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