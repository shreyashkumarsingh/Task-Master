import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    console.log('Registration request received:', {
      method: req.method,
      headers: req.headers,
      body: req.body
    });

    // For now, just return success without any validation
    // This is to test if the serverless function works at all
    res.status(201).json({
      message: 'Registration endpoint working!',
      success: true,
      timestamp: new Date().toISOString(),
      receivedData: req.body
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
  }
}
