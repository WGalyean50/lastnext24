import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  try {
    console.log('🧪 TEST: Function started successfully');
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      console.log('🧪 TEST: Handling OPTIONS request');
      res.status(200).end();
      return;
    }

    console.log('🧪 TEST: Processing request:', {
      method: req.method,
      contentType: req.headers['content-type'],
      hasOpenAIKey: !!process.env.OPENAI_API_KEY
    });

    // Test 1: Basic response without OpenAI
    if (req.query.test === 'basic') {
      console.log('🧪 TEST: Basic test successful');
      res.status(200).json({
        success: true,
        test: 'basic',
        message: 'Function works without OpenAI'
      });
      return;
    }

    // Test 2: Import OpenAI SDK
    console.log('🧪 TEST: Attempting to import OpenAI...');
    const { createOpenAIClient } = await import('./lib/openai');
    console.log('🧪 TEST: OpenAI import successful');

    // Test 3: Create OpenAI client
    console.log('🧪 TEST: Creating OpenAI client...');
    const openai = createOpenAIClient();
    console.log('🧪 TEST: OpenAI client created successfully');

    // Test 4: Try a simple OpenAI call (not transcription)
    if (req.query.test === 'openai') {
      console.log('🧪 TEST: Testing OpenAI connection...');
      // Just test the client exists, don't make actual API call
      res.status(200).json({
        success: true,
        test: 'openai',
        message: 'OpenAI client created successfully',
        hasClient: !!openai
      });
      return;
    }

    // Default response
    res.status(200).json({
      success: true,
      message: 'Test endpoint working',
      availableTests: ['?test=basic', '?test=openai']
    });

  } catch (error) {
    console.error('🧪 TEST ERROR:', {
      error: error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.substring(0, 200) : undefined,
      type: typeof error,
      name: error instanceof Error ? error.name : 'Unknown'
    });

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      test: 'FAILED',
      step: 'Unknown'
    });
  }
}