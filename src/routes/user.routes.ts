import { Router, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import userService from '../features/auth/services';
import { AuthRequest } from '../interfaces/auth.interface';
import { ApiResponse, UserPublic } from '../types';

const router = Router();

router.get(
  '/profile',
  authMiddleware,
  async (req: AuthRequest, res: Response<{ user: UserPublic } | ApiResponse>): Promise<void> => {
    try {
      const user = await userService.findById(req.user!.id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const userPublic: UserPublic = {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      };

      res.json({ user: userPublic });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.put(
  '/profile',
  authMiddleware,
  async (
    req: AuthRequest,
    res: Response<{ message: string; user: UserPublic } | ApiResponse>
  ): Promise<void> => {
    try {
      const { name, email } = req.body as { name?: string; email?: string };

      if (!name || !email) {
        res.status(400).json({ message: 'Name and email are required' });
        return;
      }

      const updatedUser = await userService.updateUser(req.user!.id, { name, email });

      const userPublic: UserPublic = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        updated_at: updatedUser.updated_at,
      };

      res.json({
        message: 'Profile updated successfully',
        user: userPublic,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
