const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

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

export const taskAPI = {
  // Get all tasks for the authenticated user
  getTasks: async (): Promise<Task[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      return data.tasks;
    } catch (error) {
      console.error('Get tasks error:', error);
      return [];
    }
  },

  // Create a new task
  createTask: async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Task | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData)
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const data = await response.json();
      return data.task;
    } catch (error) {
      console.error('Create task error:', error);
      return null;
    }
  },

  // Update an existing task
  updateTask: async (id: string, updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>): Promise<Task | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const data = await response.json();
      return data.task;
    } catch (error) {
      console.error('Update task error:', error);
      return null;
    }
  },

  // Delete a task
  deleteTask: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      return response.ok;
    } catch (error) {
      console.error('Delete task error:', error);
      return false;
    }
  }
};
