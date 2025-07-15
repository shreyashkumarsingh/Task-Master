import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tasksRouter from './routes/tasks';
import authRouter from './routes/auth';
import usersRouter from './routes/users';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

// Configure CORS for production - Allow all origins for now
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

console.log('CORS configured to allow all origins');
console.log('Environment variables:', {
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  NODE_ENV: process.env.NODE_ENV
});

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('TaskMaster Backend is running!');
});

// Direct test endpoints to bypass router issues
app.get('/api/direct-test', (req: Request, res: Response) => {
  res.json({ message: 'Direct endpoint working!' });
});

app.post('/api/direct-register', (req: Request, res: Response) => {
  res.status(201).json({ message: 'Direct registration successful!', body: req.body });
});

app.use('/api/tasks', tasksRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

// Start the server (works for both local and Render)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

// Export the Express app for compatibility
export default app;
