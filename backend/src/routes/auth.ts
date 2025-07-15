import { Router, Request, Response } from 'express';

const router = Router();

// Super simple test endpoint
router.get('/test', (req: Request, res: Response) => {
  res.json({ 
    message: 'Auth router is working!', 
    timestamp: new Date().toISOString() 
  });
});

// Simple in-memory user storage (replace with real database in production)
let users: Array<{
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}> = [];

// Debug endpoint to check users
router.get('/debug-users', (req: Request, res: Response) => {
  try {
    res.json({
      totalUsers: users.length,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        hasPassword: !!user.password,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read users' });
  }
});

// Clear users for testing
router.delete('/debug-clear-users', (req: Request, res: Response) => {
  try {
    users = [];
    res.json({ message: 'All users cleared', totalUsers: users.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear users' });
  }
});

// Super simple registration endpoint for debugging
router.post('/register', (req: Request, res: Response) => {
  try {
    console.log('Simple registration attempt:', req.body);
    
    const { name, email, password } = req.body || {};

    // Basic validation
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    console.log('All fields present, creating user...');
    
    // Create simple user object
    const newUser = {
      id: `user_${Date.now()}`,
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      password: String(password),
      createdAt: new Date().toISOString()
    };

    // Add to array
    users.push(newUser);
    console.log('User created successfully. Total users:', users.length);

    // Return success
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      },
      token: `token-${newUser.id}`
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: String(error)
    });
  }
});

// Simple login endpoint
router.post('/login', (req: Request, res: Response) => {
  try {
    console.log('Simple login attempt:', req.body);
    const { email, password } = req.body || {};

    // Validation
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    console.log('Looking for user with email:', email, 'in', users.length, 'users');
    const user = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('User found:', user.email);
    
    // Check password
    if (user.password !== password) {
      console.log('Password mismatch');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('Login successful');

    // Return success
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      token: `token-${user.id}`
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: String(error)
    });
  }
});

export default router;
