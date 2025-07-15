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

const DB_PATH = path.join(__dirname, '../../data/database.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
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
  ensureDataDir();
  
  if (!fs.existsSync(DB_PATH)) {
    const initialData = initializeDatabase();
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    const initialData = initializeDatabase();
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }
};

// Write database
export const writeDatabase = (data: Database): void => {
  ensureDataDir();
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
    throw new Error('Failed to save data');
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
