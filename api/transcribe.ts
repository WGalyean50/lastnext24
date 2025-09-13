import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import { readFileSync } from 'fs';
import OpenAI from 'openai';

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
  let stepName = 'INITIALIZATION';
  
  try {
    // 🚀 COMPREHENSIVE LOGGING AT FUNCTION START
    console.log('🚀 TRANSCRIBE FUNCTION START', {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      headers: {
        'content-type': req.headers['content-type'],
        'content-length': req.headers['content-length'],
        'user-agent': req.headers['user-agent']?.substring(0, 50),
      },
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      openAIKeyLength: process.env.OPENAI_API_KEY?.length,
      openAIKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 7) + '...',
      bodyType: typeof req.body,
      queryParams: req.query,
      nodeVersion: process.version,
      platform: process.platform
    });

    stepName = 'CORS_HEADERS';
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    console.log('✅ CORS headers set successfully');

    stepName = 'OPTIONS_REQUEST_CHECK';
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      console.log('📋 Handling OPTIONS preflight request');
      res.status(200).end();
      return;
    }

    stepName = 'METHOD_VALIDATION';
    // Only allow POST requests
    if (req.method !== 'POST') {
      console.log('❌ Invalid HTTP method:', req.method);
      res.status(405).json({
        success: false,
        error: 'Method not allowed. Use POST.'
      } as TranscriptionResponse);
      return;
    }
    console.log('✅ POST method validated');

    stepName = 'API_KEY_VALIDATION';
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.log('❌ OpenAI API key not configured');
      res.status(503).json({
        success: false,
        error: 'Transcription service unavailable: OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.'
      } as TranscriptionResponse);
      return;
    }
    console.log('✅ OpenAI API key validated');

    stepName = 'CONTENT_TYPE_VALIDATION';
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
    console.log('✅ Content-Type validated');

    stepName = 'FORM_PARSING';
    // Parse the audio file from the request
    console.log('🎤 Starting form parsing...');
    const audioFile = await parseAudioFile(req);
    if (!audioFile) {
      console.log('❌ No audio file found after parsing');
      res.status(400).json({
        success: false,
        error: 'No audio file provided'
      } as TranscriptionResponse);
      return;
    }
    console.log('✅ Audio file parsed successfully:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type
    });

    stepName = 'AUDIO_FILE_VALIDATION';
    // Check if the audio file has content
    if (audioFile.size === 0) {
      console.log('❌ Audio file is empty');
      res.status(400).json({
        success: false,
        error: 'Audio file is empty. Please record some audio before submitting.'
      } as TranscriptionResponse);
      return;
    }
    console.log('✅ Audio file size validated:', audioFile.size, 'bytes');

    stepName = 'OPENAI_CLIENT_CREATION';
    // Create OpenAI client directly (no external import)
    console.log('🤖 Creating OpenAI client...');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('✅ OpenAI client created successfully');

    stepName = 'OPENAI_API_CALL';
    // Record start time for duration tracking
    const startTime = Date.now();
    
    console.log('🎯 Calling OpenAI Whisper API with:', {
      fileSize: audioFile.size,
      fileName: audioFile.name,
      fileType: audioFile.type,
      model: 'whisper-1'
    });

    // Create transcription using Whisper with enhanced compatibility
    console.log('🎯 Preparing OpenAI request with file:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type
    });
    
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
      response_format: 'text',
      // Add additional parameters for better compatibility
      temperature: 0.0, // More deterministic transcription
    });

    stepName = 'RESPONSE_PROCESSING';
    const duration = Date.now() - startTime;
    console.log('✅ OpenAI Whisper API successful:', {
      transcriptionLength: transcription.length,
      duration: `${duration}ms`,
      preview: transcription.substring(0, 100) + '...'
    });

    // Return successful response
    console.log('🎉 Sending successful response to client');
    res.status(200).json({
      success: true,
      transcription: transcription,
      duration
    } as TranscriptionResponse);

  } catch (error) {
    // 🚨 COMPREHENSIVE ERROR CAPTURE AND LOGGING
    console.error(`❌ TRANSCRIBE FUNCTION ERROR at step: ${stepName}`, {
      step: stepName,
      timestamp: new Date().toISOString(),
      error: error,
      errorType: typeof error,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack?.substring(0, 500) : undefined,
      errorCode: (error as any)?.code,
      errorStatus: (error as any)?.status,
      isOpenAIError: error && typeof error === 'object' && 'code' in error,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      nodeVersion: process.version,
      platform: process.platform
    });
    
    // Additional OpenAI-specific error logging
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('🤖 OpenAI API Error Details:', {
        code: (error as any).code,
        type: (error as any).type,
        param: (error as any).param,
        message: (error as any).message
      });
    }
    
    // Try to provide helpful error messages based on the step where it failed
    let userFriendlyMessage = 'Transcription failed';
    let statusCode = 500;
    
    switch (stepName) {
      case 'INITIALIZATION':
      case 'CORS_HEADERS':
        userFriendlyMessage = 'Server initialization failed';
        statusCode = 503;
        break;
      case 'API_KEY_VALIDATION':
        userFriendlyMessage = 'OpenAI API key validation failed';
        statusCode = 503;
        break;
      case 'CONTENT_TYPE_VALIDATION':
        userFriendlyMessage = 'Invalid audio data format';
        statusCode = 400;
        break;
      case 'FORM_PARSING':
        userFriendlyMessage = 'Failed to process audio file';
        statusCode = 400;
        break;
      case 'OPENAI_CLIENT_CREATION':
        userFriendlyMessage = 'OpenAI service initialization failed';
        statusCode = 503;
        break;
      case 'OPENAI_API_CALL':
        userFriendlyMessage = 'OpenAI Whisper API call failed';
        statusCode = 502;
        break;
      case 'RESPONSE_PROCESSING':
        userFriendlyMessage = 'Failed to process transcription result';
        statusCode = 500;
        break;
      default:
        userFriendlyMessage = `Function failed at ${stepName}`;
    }
    
    // Include specific error details for debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    const debugInfo = `Step: ${stepName}, Error: ${errorMessage}`;
    
    console.error(`🎯 Sending ${statusCode} response to client:`, userFriendlyMessage);
    res.status(statusCode).json({
      success: false,
      error: `${userFriendlyMessage}: ${errorMessage}`,
      step: stepName,
      debug: debugInfo,
      timestamp: new Date().toISOString()
    } as TranscriptionResponse & { step: string; debug: string; timestamp: string });
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

          // Create File object with proper stream for OpenAI API
          // Use Blob instead of File for better compatibility
          const audioBlob = new Blob([fileBuffer], { type: mimeType });
          
          // Create a File-like object with additional properties OpenAI expects
          const fileObject = Object.assign(audioBlob, {
            name: filename,
            lastModified: Date.now(),
            webkitRelativePath: ""
          }) as File;
          
          console.log('🚀 File object created successfully:', {
            size: fileObject.size,
            name: filename,
            type: mimeType,
            isBlob: fileObject instanceof Blob,
            hasName: 'name' in fileObject
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