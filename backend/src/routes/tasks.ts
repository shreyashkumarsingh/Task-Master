import { Router, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { createTask, findTasksByUserId, updateTask, deleteTask } from '../database/db';

const router = Router();

// Get all tasks for authenticated user
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const tasks = findTasksByUserId(userId);
    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new task
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { title, description, priority, category, dueDate, dueTime } = req.body;

    if (!title || !priority || !category) {
      return res.status(400).json({ error: 'Title, priority, and category are required' });
    }

    const newTask = createTask({
      userId,
      title: title.trim(),
      description: description?.trim(),
      completed: false,
      priority,
      category: category.trim(),
      dueDate,
      dueTime
    });

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a task
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const updates = req.body;

    // First verify the task belongs to the user
    const userTasks = findTasksByUserId(userId);
    const taskExists = userTasks.find(task => task.id === id);
    
    if (!taskExists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = updateTask(id, updates);
    
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a task
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // First verify the task belongs to the user
    const userTasks = findTasksByUserId(userId);
    const taskExists = userTasks.find(task => task.id === id);
    
    if (!taskExists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const deleted = deleteTask(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
