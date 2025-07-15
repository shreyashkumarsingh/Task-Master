import { VercelRequest, VercelResponse } from '@vercel/node';

// Note: In a real app, you'd use a shared database
// For now, this is just for testing the endpoint structure
const users: Array<{ id: string; name: string; email: string; password: string }> = [];

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
    const { email, password } = req.body || {};

    // Basic validation
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // For testing, let's just return success for any email/password
    // In real implementation, you'd check against database
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: email
      },
      token: 'test-token'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: String(error)
    });
  }
}
