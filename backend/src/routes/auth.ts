import { Router } from 'express';

const router = Router();

// Example: POST /api/auth/login
router.post('/login', (req, res) => {
  // Dummy login
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    res.json({ token: 'dummy-token', user: { username } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

export default router;
