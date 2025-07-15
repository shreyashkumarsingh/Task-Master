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

// For Vercel serverless functions, we'll use a different approach
// In production, this should be replaced with a proper database
let inMemoryDB: Database = {
  users: [],
  tasks: []
};

const DB_PATH = path.join(process.cwd(), 'data/database.json');

// Ensure data directory exists
const ensureDataDir = () => {
  try {
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  } catch (error) {
    console.warn('Could not create data directory, using in-memory storage');
  }
};

// Initialize database if it doesn't exist
const initializeDatabase = (): Database => {
  return {
    users: [],
    tasks: []
  };
};

// Read database
export const readDatabase = (): Database => {
  try {
    ensureDataDir();
    
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      const parsed = JSON.parse(data);
      inMemoryDB = parsed;
      return parsed;
    }
  } catch (error) {
    console.warn('Could not read from file, using in-memory storage:', error);
  }
  
  // Fallback to in-memory database
  if (inMemoryDB.users.length === 0 && inMemoryDB.tasks.length === 0) {
    inMemoryDB = initializeDatabase();
  }
  
  return inMemoryDB;
};

// Write database
export const writeDatabase = (data: Database): void => {
  try {
    ensureDataDir();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.warn('Could not write to file, keeping in memory only:', error);
  }
  
  // Always update in-memory copy
  inMemoryDB = data;
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
