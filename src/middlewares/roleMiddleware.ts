import { Response, NextFunction } from 'express';
import { AuthRequest } from '../interfaces/auth.interface';
import { UserRole } from '../types';
import userService from '../features/auth/services';

export const requireRole = (...allowedRoles: UserRole[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const user = await userService.findById(req.user.id);
      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      const userRole = user.role || 'buyer';

      if (!allowedRoles.includes(userRole)) {
        res.status(403).json({
          message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${userRole}`,
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
};
