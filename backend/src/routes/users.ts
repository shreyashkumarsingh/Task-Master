import { Router } from 'express';

const router = Router();

// Example: GET /api/users
router.get('/', (req, res) => {
  res.json([
    { id: 1, username: 'admin' },
    { id: 2, username: 'user' }
  ]);
});

export default router;
