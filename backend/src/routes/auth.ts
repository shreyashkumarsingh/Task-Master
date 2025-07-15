import { Router, Request, Response } from 'express';
import { createUser, findUserByEmail } from '../database/db';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Registration endpoint
router.post('/register', async (req: Request, res: Response) => {
  try {
    console.log('Registration attempt:', { email: req.body?.email });
    
    const { name, email, password } = req.body || {};

    // Basic validation
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    console.log('Creating user...');
    
    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const newUser = createUser({
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      password: hashedPassword
    });

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email
    });

    console.log('User created successfully:', newUser.email);

    // Return success
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      },
      token
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: String(error)
    });
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    console.log('Login attempt:', { email: req.body?.email });
    const { email, password } = req.body || {};

    // Validation
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = findUserByEmail(email);
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('User found:', user.email);
    
    // Check password
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    console.log('Login successful');

    // Return success
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: String(error)
    });
  }
});

// Token verification endpoint
router.get('/verify', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log('Token verification for user:', req.user?.email);
    res.json({
      message: 'Token valid',
      user: req.user
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
