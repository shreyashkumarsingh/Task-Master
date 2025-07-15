import { Router, Request, Response } from 'express';
import { createUser, findUserByEmail, readDatabase } from '../database/db';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

const router = Router();

// Simple debug endpoint 
router.get('/debug', (req: Request, res: Response) => {
  res.json({ message: 'Debug endpoint working', timestamp: new Date().toISOString() });
});

// Debug endpoint to check database state (remove in production)
router.get('/debug-users', (req: Request, res: Response) => {
  try {
    const db = readDatabase();
    const userSummary = db.users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      hasPassword: !!user.password,
      passwordLength: user.password?.length || 0,
      createdAt: user.createdAt
    }));
    res.json({
      totalUsers: db.users.length,
      users: userSummary
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read database' });
  }
});

// Debug endpoint to clear all users (remove in production)
router.delete('/debug-clear-users', (req: Request, res: Response) => {
  try {
    const db = readDatabase();
    db.users = [];
    db.tasks = [];
    // Force write to both file and memory
    const { writeDatabase } = require('../database/db');
    writeDatabase(db);
    res.json({ message: 'All users cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear users' });
  }
});

// Simple test registration endpoint
router.post('/test-register', async (req: Request, res: Response) => {
  try {
    console.log('Test registration attempt');
    const { name, email, password } = req.body;
    
    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    
    // Try to create user with simple ID
    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: 'simple_hash_' + password, // Simple hash for testing
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Test in-memory storage only
    const db = readDatabase();
    db.users.push(newUser);
    
    console.log('User created successfully:', newUser.email);
    
    res.status(201).json({
      message: 'Test user created',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Test registration error:', error);
    res.status(500).json({ 
      error: 'Test registration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Register endpoint
router.post('/register', async (req: Request, res: Response) => {
  try {
    console.log('Registration attempt:', { body: req.body });
    
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
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    console.log('Hashing password...');
    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    
    console.log('Creating user...');
    const newUser = createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    console.log('Generating token...');
    // Generate token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email
    });

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
      token
    });
  } catch (error) {
    console.error('Registration error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error');
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    });
  }
});

// Simple test login endpoint
router.post('/test-login', async (req: Request, res: Response) => {
  try {
    console.log('Test login attempt');
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }
    
    const db = readDatabase();
    console.log('Total users in database:', db.users.length);
    
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ error: 'User not found' });
    }
    
    console.log('User found:', user.email);
    console.log('Expected password:', 'simple_hash_' + password);
    console.log('Stored password:', user.password);
    
    // Simple password check
    if (user.password !== 'simple_hash_' + password) {
      return res.status(401).json({ error: 'Wrong password' });
    }
    
    res.json({
      message: 'Test login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Test login error:', error);
    res.status(500).json({ 
      error: 'Test login failed',
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
    const user = findUserByEmail(email);
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('User found:', { id: user.id, email: user.email, hasPassword: !!user.password });
    console.log('Stored password hash:', user.password);
    console.log('Attempting to verify password...');

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    console.log('Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Password validation failed');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('Login successful for user:', user.email);

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

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
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token endpoint
router.get('/verify', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.substring(7);
    const decoded = require('../utils/auth').verifyToken(token);
    const user = findUserByEmail(decoded.email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    res.json({
      valid: true,
      user: userResponse
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
