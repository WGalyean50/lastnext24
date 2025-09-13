import type { VercelRequest, VercelResponse } from '@vercel/node';

// Temporary demo transcription endpoint while OpenAI API key is being configured
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
    console.log('🎭 Demo transcription endpoint called');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate realistic demo transcription
    const demoTranscriptions = [
      "Today I completed work on the user authentication system and made good progress on the API endpoints. The team collaboration has been excellent and we're on track for this week's sprint goals.",
      "I focused on bug fixes in the frontend components and improved the user interface responsiveness. Also coordinated with the design team on the new feature specifications.",
      "Made significant progress on the database optimization project. Performance improvements are showing great results in our testing environment. Planning to deploy to staging tomorrow.",
      "Worked on client requirements gathering and documentation updates. The new project roadmap is taking shape and stakeholders are aligned on priorities.",
      "Completed code reviews and helped onboard the new team member. Knowledge transfer sessions went well and development velocity is increasing."
    ];
    
    const randomTranscription = demoTranscriptions[Math.floor(Math.random() * demoTranscriptions.length)];
    
    console.log('✅ Demo transcription generated successfully');
    
    // Return successful demo response
    res.status(200).json({
      success: true,
      transcription: `[DEMO MODE] ${randomTranscription}`,
      duration: 1500,
      demo: true
    } as TranscriptionResponse & { demo: boolean });

  } catch (error) {
    console.error('❌ Demo transcription error:', error);
    res.status(500).json({
      success: false,
      error: 'Demo transcription failed'
    } as TranscriptionResponse);
  }
}