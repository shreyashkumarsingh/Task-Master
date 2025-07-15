import { Router, Request, Response } from 'express';

const router = Router();

// Simple in-memory user storage for debugging
let tempUsers: Array<{id: string, name: string, email: string, password: string}> = [];

// Minimal registration for debugging
router.post('/minimal-register', (req: Request, res: Response) => {
  try {
    console.log('Minimal registration attempt:', req.body);
    
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if user exists
    const existing = tempUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create user
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password // Store plaintext for debugging (NOT for production!)
    };
    
    tempUsers.push(newUser);
    console.log('User created successfully:', newUser.email);
    console.log('Total users now:', tempUsers.length);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
    
  } catch (error) {
    console.error('Minimal registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Minimal login for debugging
router.post('/minimal-login', (req: Request, res: Response) => {
  try {
    console.log('Minimal login attempt:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }
    
    console.log('Looking for user in', tempUsers.length, 'users');
    console.log('Users:', tempUsers.map(u => ({ email: u.email, id: u.id })));
    
    const user = tempUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    console.log('User found:', user.email);
    console.log('Password check:', password, '===', user.password, '?', password === user.password);
    
    if (user.password !== password) {
      console.log('Password mismatch');
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    console.log('Login successful');
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token: 'fake-token-for-debugging'
    });
    
  } catch (error) {
    console.error('Minimal login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Debug endpoint to see current users
router.get('/debug-users', (req: Request, res: Response) => {
  res.json({
    totalUsers: tempUsers.length,
    users: tempUsers.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      hasPassword: !!u.password
    }))
  });
});

export default router;
