import express, { Express, Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import passport from 'passport';
import { sequelize, testConnection } from './db/connection';
import authRoutes from './features/auth/routes';
import userRoutes from './routes/user.routes';
import uploadRoutes from './routes/upload.routes';
import { settings } from './config/settings';
import User from './features/auth/models/UserModel';
import File from './models/FileModel';
import { initializeSocketIO } from './socket/socketServer';
import './config/passport';

const app: Express = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static('uploads'));

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
    console.log('📦 Models loaded:', User.name, File.name);

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
