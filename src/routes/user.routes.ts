import { Router, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import userService from '../features/auth/services';
import { AuthRequest } from '../interfaces/auth.interface';
import { ApiResponse, UserPublic } from '../types';
import { getIO } from '../utils/socketServer';

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
        profile_picture_url: user.profile_picture_url || null,
        role: user.role || 'buyer',
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
      const { name, email, role } = req.body as {
        name?: string;
        email?: string;
        role?: 'buyer' | 'seller' | 'admin';
      };

      if (!name || !email) {
        res.status(400).json({ message: 'Name and email are required' });
        return;
      }

      const updateData: { name: string; email: string; role?: 'buyer' | 'seller' | 'admin' } = {
        name,
        email,
      };

      if (role) {
        updateData.role = role;
      }

      const updatedUser = await userService.updateUser(req.user!.id, updateData);

      const userPublic: UserPublic = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        profile_picture_url: updatedUser.profile_picture_url || null,
        role: updatedUser.role || 'buyer',
        created_at: updatedUser.created_at,
      };

      // Emit Socket.IO event for real-time update
      try {
        const io = getIO();
        if (req.user?.id) {
          io.to(req.user.id).emit('profile:updated', { user: userPublic });
          io.to(req.user.id).emit('user:updated', { user: userPublic });
        }
      } catch (error) {
        // Socket.IO error shouldn't break the response
        console.error('Socket.IO emit error:', error);
      }

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

router.put(
  '/role',
  authMiddleware,
  async (
    req: AuthRequest,
    res: Response<{ message: string; user: UserPublic } | ApiResponse>
  ): Promise<void> => {
    try {
      const { role } = req.body as { role?: 'buyer' | 'seller' | 'admin' };

      if (!role || !['buyer', 'seller', 'admin'].includes(role)) {
        res.status(400).json({ message: 'Valid role (buyer, seller, or admin) is required' });
        return;
      }

      const updatedUser = await userService.updateUser(req.user!.id, { role });

      const userPublic: UserPublic = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        profile_picture_url: updatedUser.profile_picture_url || null,
        role: updatedUser.role || 'buyer',
        created_at: updatedUser.created_at,
      };

      // Emit Socket.IO event for real-time update
      try {
        const io = getIO();
        if (req.user?.id) {
          io.to(req.user.id).emit('profile:updated', { user: userPublic });
          io.to(req.user.id).emit('user:updated', { user: userPublic });
        }
      } catch (error) {
        // Socket.IO error shouldn't break the response
        console.error('Socket.IO emit error:', error);
      }

      res.json({
        message: 'Role updated successfully',
        user: userPublic,
      });
    } catch (error) {
      console.error('Update role error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
