import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { settings } from '../config/settings';
import userService from '../features/auth/services';
import { JWTPayload } from '../types';
import { AuthRequest } from '../interfaces/auth.interface';

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    const decoded = jwt.verify(token, settings.jwt.secret) as JWTPayload;
    const user = await userService.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ message: 'Token is not valid' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
