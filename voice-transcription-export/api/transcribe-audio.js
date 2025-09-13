module.exports = function(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Whisper transcription service is running - Demo Mode',
      configured: !!process.env.OPENAI_API_KEY,
      timestamp: new Date().toISOString(),
      note: 'Serverless functions are experiencing deployment issues. Using demo mode.'
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json({
      success: true,
      transcript: 'Demo transcription: This is a sample transcription. The audio recording functionality is working, but OpenAI Whisper integration requires resolving Vercel serverless function deployment issues.',
      service: 'demo-mode',
      timestamp: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};