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
      console.log('API: Fetching tasks from:', `${API_BASE_URL}/api/tasks`);
      
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        headers: getAuthHeaders()
      });

      console.log('API: Get tasks response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API: Get tasks failed:', response.status, errorText);
        throw new Error(`Failed to fetch tasks: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('API: Tasks fetched successfully:', data.tasks?.length || 0, 'tasks');
      return data.tasks || [];
    } catch (error) {
      console.error('Get tasks error:', error);
      return [];
    }
  },

  // Create a new task
  createTask: async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Task | null> => {
    try {
      console.log('API: Creating task with data:', taskData);
      console.log('API: Using base URL:', API_BASE_URL);
      
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData)
      });

      console.log('API: Create task response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API: Create task failed:', response.status, errorText);
        throw new Error(`Failed to create task: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('API: Task created successfully:', data);
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
