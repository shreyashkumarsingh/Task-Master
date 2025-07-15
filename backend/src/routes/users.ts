import { Router, Response, Request } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { findUserById } from '../database/db';

const router = Router();

// Get current user profile
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
