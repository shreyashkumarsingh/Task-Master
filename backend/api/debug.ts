import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Return environment info (don't expose secrets)
  res.status(200).json({
    message: 'Debug endpoint working!',
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    frontendUrl: process.env.FRONTEND_URL ? 'SET' : 'NOT_SET',
    jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT_SET',
    hasEnvVars: Object.keys(process.env).length > 0,
    envKeys: Object.keys(process.env).filter(key => !key.includes('SECRET') && !key.includes('TOKEN')),
    vercelEnv: process.env.VERCEL_ENV,
    vercelUrl: process.env.VERCEL_URL
  });
}
