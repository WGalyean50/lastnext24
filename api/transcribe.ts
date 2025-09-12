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

    // Validate content type (be more flexible)
    const contentType = req.headers['content-type'];
    console.log('📋 Request content type:', contentType);
    
    if (!contentType || !contentType.includes('multipart/form-data')) {
      console.error('❌ Invalid content type received:', contentType);
      res.status(400).json({
        success: false,
        error: `Content-Type must be multipart/form-data, received: ${contentType || 'none'}`
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
    console.log('🎤 Starting form parsing...');
    
    // Configure formidable with more permissive settings
    const form = formidable({
      maxFileSize: 25 * 1024 * 1024, // 25MB max file size (OpenAI Whisper limit)
      multiples: false,
      keepExtensions: true,
      allowEmptyFiles: false,
      // Ensure temp directory exists and is writable
      uploadDir: '/tmp',
      // Handle different encodings gracefully
      encoding: 'utf-8'
    });

    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        console.log('📋 Form parsing completed');
        console.log('🔍 Fields:', Object.keys(fields || {}));
        console.log('📁 Files:', Object.keys(files || {}));
        
        if (err) {
          console.error('❌ Formidable parse error:', {
            name: err.name,
            message: err.message,
            code: (err as any).code,
            stack: err.stack?.substring(0, 200)
          });
          resolve(null);
          return;
        }

        // Look for audio file in multiple possible field names
        let audioFile = files.audio || files.file || files.recording;
        
        // If no direct match, try the first file available
        if (!audioFile && files) {
          const fileKeys = Object.keys(files);
          if (fileKeys.length > 0) {
            audioFile = files[fileKeys[0]];
            console.log(`🔄 Using first available file field: ${fileKeys[0]}`);
          }
        }
        
        if (!audioFile) {
          console.error('❌ No audio file found in request');
          console.error('Available file keys:', Object.keys(files || {}));
          resolve(null);
          return;
        }
        
        console.log('✅ Audio file found:', {
          fieldName: Object.keys(files).find(key => files[key] === audioFile),
          isArray: Array.isArray(audioFile)
        });

        try {
          // Handle both single file and array of files
          const file = Array.isArray(audioFile) ? audioFile[0] : audioFile;
          
          console.log('📊 Processing file:', {
            hasFilepath: !!(file && file.filepath),
            originalFilename: file?.originalFilename || 'unnamed',
            mimetype: file?.mimetype || 'unknown',
            size: file?.size || 0,
            newFilename: file?.newFilename
          });
          
          if (!file || (!file.filepath && !file.newFilename)) {
            console.error('❌ Invalid file object - missing file path');
            resolve(null);
            return;
          }

          // Try both filepath and newFilename (different formidable versions)
          const filePath = file.filepath || file.newFilename;
          console.log('📂 Reading file from path:', filePath);
          
          // Read the file data
          const fileBuffer = readFileSync(filePath);
          console.log('✅ File buffer read successfully:', {
            size: fileBuffer.length,
            sizeKB: (fileBuffer.length / 1024).toFixed(2) + ' KB',
            sizeMB: (fileBuffer.length / (1024 * 1024)).toFixed(2) + ' MB'
          });
          
          // Validate buffer size
          if (fileBuffer.length === 0) {
            console.error('❌ Audio file is empty');
            resolve(null);
            return;
          }
          
          // Determine the MIME type
          let mimeType = file.mimetype || 'audio/webm';
          let filename = file.originalFilename || 'recording.webm';
          
          // Clean up MIME type based on common audio formats
          if (mimeType.includes('mp4') || filename.endsWith('.mp4')) {
            mimeType = 'audio/mp4';
            filename = filename.endsWith('.mp4') ? filename : 'recording.mp4';
          } else if (mimeType.includes('webm') || filename.endsWith('.webm')) {
            mimeType = 'audio/webm';
            filename = filename.endsWith('.webm') ? filename : 'recording.webm';
          } else if (mimeType.includes('wav') || filename.endsWith('.wav')) {
            mimeType = 'audio/wav';
            filename = filename.endsWith('.wav') ? filename : 'recording.wav';
          } else if (mimeType.includes('mpeg') || filename.endsWith('.mp3')) {
            mimeType = 'audio/mpeg';
            filename = filename.endsWith('.mp3') ? filename : 'recording.mp3';
          }
          
          console.log('🎯 Final file details for OpenAI:', {
            mimeType,
            filename,
            bufferSize: fileBuffer.length
          });

          // Create a File-like object compatible with OpenAI API
          const fileObject = new File([fileBuffer], filename, { type: mimeType });
          
          console.log('🚀 File object created successfully:', {
            size: fileObject.size,
            name: fileObject.name,
            type: fileObject.type
          });
          
          resolve(fileObject);
        } catch (readError) {
          console.error('❌ Error reading uploaded file:', readError);
          resolve(null);
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Error in parseAudioFile:', error);
    return null;
  }
}