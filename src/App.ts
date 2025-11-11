import express, { Express, Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import path from 'path';
import { sequelize, testConnection } from './db/connection';
import authRoutes from './features/auth/routes';
import userRoutes from './routes/user.routes';
import uploadRoutes from './routes/upload.routes';
import profilePictureRoutes from './routes/profile-picture.routes';
import bookRoutes from './features/books/routes';
import { settings } from './config/settings';
import User from './features/auth/models/UserModel';
import File from './models/FileModel';
import Book from './features/books/models/BookModel';
import { initializeSocketIO } from './utils/socketServer';
import './config/passport';

const app: Express = express();
const httpServer = createServer(app);

app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/profile-picture', profilePictureRoutes);
app.use('/api/books', bookRoutes);

// Serve static files - handle both src/uploads (development) and uploads (production)
// __dirname in compiled code will be in dist/, so we need to go up to project root
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ message: 'Server is running!' });
});

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('Error stack:', err.stack);
  console.error('Error message:', err.message);
  console.error('Request URL:', req.url);
  console.error('Request method:', req.method);

  if (req.url.includes('/google/callback')) {
    res.redirect(`${settings.frontend.url}/login?error=oauth_failed`);
  } else {
    res.status(500).json({ message: 'Something went wrong!' });
  }
});

const startServer = async (): Promise<void> => {
  try {
    await testConnection();
    await sequelize.sync({ force: false });
    console.log('✅ Database tables synchronized');
    console.log('📦 Models loaded:', User.name, File.name, Book.name);

    initializeSocketIO(httpServer);

    httpServer.listen(settings.app.port, () => {
      console.log(`🚀 Server is running on port ${settings.app.port}`);
      console.log(`📊 Database: PostgreSQL connected`);
      console.log(`🔌 Socket.IO server initialized`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
