import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: string;
  dueTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Database {
  users: User[];
  tasks: Task[];
}

// Simple in-memory database for serverless environment
// In production, use a proper database like PostgreSQL, MongoDB, etc.
let inMemoryDB: Database = {
  users: [],
  tasks: []
};

// Try to use persistent storage, fall back to memory-only
// Use a Windows-compatible path for local development
const getDbPath = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return '/tmp/database.json'; // Vercel/Render writable directory
  } else {
    // For local development on Windows/Mac/Linux
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    return path.join(dataDir, 'database.json');
  }
};

const DB_PATH = getDbPath();

const initializeDatabase = (): Database => {
  return {
    users: [],
    tasks: []
  };
};

// Read database with better error handling
export const readDatabase = (): Database => {
  try {
    // Try to read from persistent storage first
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      const parsed = JSON.parse(data);
      console.log('Database loaded from file, users count:', parsed.users?.length || 0);
      inMemoryDB = parsed;
      return parsed;
    }
  } catch (error) {
    console.warn('Could not read from persistent storage:', error);
  }
  
  console.log('Using in-memory database, users count:', inMemoryDB.users.length);
  return inMemoryDB;
};

// Write database with better error handling
export const writeDatabase = (data: Database): void => {
  // Always update in-memory copy first
  inMemoryDB = data;
  
  // Try to persist to disk
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    console.log('Database saved to file successfully');
  } catch (error) {
    console.warn('Could not write to persistent storage, using memory only:', error);
  }
};

// User operations
export const createUser = (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
  const db = readDatabase();
  const newUser: User = {
    ...user,
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  db.users.push(newUser);
  writeDatabase(db);
  return newUser;
};

export const findUserByEmail = (email: string): User | undefined => {
  const db = readDatabase();
  return db.users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const findUserById = (id: string): User | undefined => {
  const db = readDatabase();
  return db.users.find(user => user.id === id);
};

// Task operations
export const createTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
  const db = readDatabase();
  const newTask: Task = {
    ...task,
    id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  db.tasks.push(newTask);
  writeDatabase(db);
  return newTask;
};

export const findTasksByUserId = (userId: string): Task[] => {
  const db = readDatabase();
  return db.tasks.filter(task => task.userId === userId);
};

export const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null => {
  const db = readDatabase();
  const taskIndex = db.tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return null;
  }
  
  db.tasks[taskIndex] = {
    ...db.tasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  writeDatabase(db);
  return db.tasks[taskIndex];
};

export const deleteTask = (id: string): boolean => {
  const db = readDatabase();
  const taskIndex = db.tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return false;
  }
  
  db.tasks.splice(taskIndex, 1);
  writeDatabase(db);
  return true;
};
