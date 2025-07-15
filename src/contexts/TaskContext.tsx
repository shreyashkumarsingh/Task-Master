import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { taskAPI, Task } from '@/services/api';

interface TaskContextType {
  tasks: Task[];
  categories: string[];
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleTaskComplete: (id: string) => Promise<boolean>;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  loading: boolean;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const defaultCategories = ['Personal', 'Work', 'Health', 'Learning', 'Shopping'];

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Load tasks when user is authenticated
  useEffect(() => {
    console.log('TaskContext: Auth state changed:', { isAuthenticated, userId: user?.id });
    if (isAuthenticated && user) {
      console.log('TaskContext: User authenticated, refreshing tasks');
      refreshTasks();
    } else {
      console.log('TaskContext: User not authenticated, clearing tasks');
      setTasks([]);
    }
  }, [isAuthenticated, user]);

  // Load categories from localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Save categories to localStorage
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const refreshTasks = async () => {
    if (!isAuthenticated) {
      console.log('TaskContext: User not authenticated, skipping task refresh');
      return;
    }
    
    console.log('TaskContext: Refreshing tasks for authenticated user');
    setLoading(true);
    try {
      const fetchedTasks = await taskAPI.getTasks();
      console.log('TaskContext: Tasks fetched:', fetchedTasks.length);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to refresh tasks:', error);
      // Don't clear tasks on error, keep existing ones
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    if (!isAuthenticated) {
      console.error('User not authenticated');
      return false;
    }

    try {
      console.log('Creating task:', taskData);
      const newTask = await taskAPI.createTask(taskData);
      if (newTask) {
        console.log('Task created successfully:', newTask);
        setTasks(prev => [...prev, newTask]);
        return true;
      } else {
        console.error('Failed to create task: API returned null');
        return false;
      }
    } catch (error) {
      console.error('Failed to add task:', error);
      return false;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const updatedTask = await taskAPI.updateTask(id, updates);
      if (updatedTask) {
        setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update task:', error);
      return false;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const success = await taskAPI.deleteTask(id);
      if (success) {
        setTasks(prev => prev.filter(task => task.id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete task:', error);
      return false;
    }
  };

  const toggleTaskComplete = async (id: string): Promise<boolean> => {
    const task = tasks.find(t => t.id === id);
    if (!task) return false;

    return await updateTask(id, { completed: !task.completed });
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const deleteCategory = (category: string) => {
    if (!defaultCategories.includes(category)) {
      setCategories(prev => prev.filter(cat => cat !== category));
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      categories,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskComplete,
      addCategory,
      deleteCategory,
      loading,
      refreshTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
