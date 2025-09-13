const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const FormData = require('form-data');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS with proper configuration
app.use(cors({
  origin: ['https://interview-hero-mvp1.vercel.app', 'http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '25mb' })); // Increased limit for audio files

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check endpoint
app.get('/', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    message: 'Interview Hero Transcription Service',
    status: 'running',
    configured: !!process.env.OPENAI_API_KEY,
    apiKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for API configuration
app.get('/test', (req, res) => {
  res.json({
    message: 'Test endpoint working',
    cors: 'Configured for Interview Hero',
    openaiConfigured: !!process.env.OPENAI_API_KEY,
    openaiKeyPrefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 7) + '...' : 'Not set',
    serverTime: new Date().toISOString()
  });
});

// Transcription endpoint
app.post('/transcribe', async (req, res) => {
  try {
    const { audioData, mimeType } = req.body;

    if (!audioData) {
      return res.status(400).json({ 
        success: false,
        error: 'No audio data provided' 
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        success: false,
        error: 'OpenAI API key not configured',
        details: 'Please set OPENAI_API_KEY environment variable'
      });
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioData, 'base64');
    
    // Log audio details for debugging
    console.log('Processing transcription request:', {
      mimeType: mimeType,
      bufferSize: audioBuffer.length,
      bufferSizeMB: (audioBuffer.length / (1024 * 1024)).toFixed(2) + ' MB'
    });

    // Validate audio size
    if (audioBuffer.length < 1000) {
      return res.status(400).json({ 
        success: false,
        error: 'Audio file too small (< 1KB)',
        details: `Audio size: ${audioBuffer.length} bytes`
      });
    }
    
    if (audioBuffer.length > 25 * 1024 * 1024) {
      return res.status(400).json({ 
        success: false,
        error: 'Audio file too large (> 25MB)',
        details: `Audio size: ${(audioBuffer.length / (1024 * 1024)).toFixed(2)} MB`
      });
    }

    // Create form data for OpenAI API - Node.js compatible approach
    const form = new FormData();
    
    // Determine file extension based on MIME type
    let fileExtension = 'webm';
    if (mimeType.includes('mp4')) {
      fileExtension = 'mp4';
    } else if (mimeType.includes('mpeg')) {
      fileExtension = 'mp3';
    } else if (mimeType.includes('wav')) {
      fileExtension = 'wav';
    }
    
    // Append the audio buffer as a file
    form.append('file', audioBuffer, {
      filename: `audio.${fileExtension}`,
      contentType: mimeType || 'audio/webm'
    });
    form.append('model', 'whisper-1');
    form.append('language', 'en');
    form.append('response_format', 'text');

    // Make direct API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders()
      },
      body: form
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const transcription = await response.text();
    
    console.log('Transcription successful:', transcription.substring(0, 100) + '...');

    res.json({
      success: true,
      transcript: transcription,
      service: 'openai-whisper',
      audioSize: audioBuffer.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Transcription error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Transcription failed',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Transcription service running on port ${port}`);
  console.log(`📡 Health check available at: http://0.0.0.0:${port}/`);
  console.log(`🔑 OpenAI API Key configured: ${!!process.env.OPENAI_API_KEY}`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});