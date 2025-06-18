import { Router } from 'express';

const router = Router();

// Example: GET /api/tasks
router.get('/', (req, res) => {
  res.json([
    { id: 1, title: 'Sample Task', completed: false },
    { id: 2, title: 'Another Task', completed: true }
  ]);
});

export default router;
