import { Router, Request, Response } from 'express';

const router = Router();

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

// Register endpoint
router.post('/register', async (req: Request, res: Response) => {
  try {
    console.log('Registration attempt:', req.body);
    
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    console.log('Checking for existing user...');
    // Check if user already exists
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    console.log('Creating user...');
    // Create user (storing plain password for debugging - NOT for production!)
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password, // Plain text for debugging
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    console.log('User created successfully:', newUser.email);
    console.log('Total users now:', users.length);

    // Return user data without password
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt
    };

    console.log('Registration successful');
    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token: `fake-token-${newUser.id}` // Fake token for debugging
    });
  } catch (error) {
    console.error('Registration error details:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    console.log('Login attempt for:', req.body.email);
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    console.log('Looking for user with email:', email);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('User found:', { id: user.id, email: user.email, hasPassword: !!user.password });
    console.log('Password check:', password, '===', user.password, '?', password === user.password);

    // Compare password (plain text for debugging)
    if (user.password !== password) {
      console.log('Password validation failed');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('Login successful for user:', user.email);

    // Return user data without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token: `fake-token-${user.id}` // Fake token for debugging
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
