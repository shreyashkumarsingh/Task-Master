import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tasksRouter from './routes/tasks';
import authRouter from './routes/auth';
import usersRouter from './routes/users';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configure CORS for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('TaskMaster Backend is running!');
});

app.use('/api/tasks', tasksRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
