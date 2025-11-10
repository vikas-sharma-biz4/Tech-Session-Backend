import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { settings } from '../config/settings';
import userService from '../features/auth/services';
import { JWTPayload } from '../types';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

let io: SocketIOServer;

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

export const initializeSocketIO = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: settings.frontend.url || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, settings.jwt.secret) as JWTPayload;
      const user = await userService.findById(decoded.userId);

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    if (socket.userId) {
      socket.join(socket.userId);
    }

    socket.on('disconnect', () => {
      // Socket disconnected
    });

    socket.on('upload:start', (data: { uploadId: string; fileName: string }) => {
      socket.emit('upload:acknowledged', { uploadId: data.uploadId, fileName: data.fileName });
    });
  });

  return io;
};
