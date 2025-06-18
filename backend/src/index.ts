import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tasksRouter from './routes/tasks';
import authRouter from './routes/auth';
import usersRouter from './routes/users';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Agenda Vista Backend is running!');
});

app.use('/api/tasks', tasksRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
