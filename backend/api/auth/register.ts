import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Simplest possible response
    return res.status(201).json({
      message: 'Registration successful!',
      success: true,
      data: req.body,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Caught error',
      details: String(error)
    });
  }
}
