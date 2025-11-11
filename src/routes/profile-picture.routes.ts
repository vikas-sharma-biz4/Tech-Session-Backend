import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authMiddleware } from '../middlewares/authMiddleware';
import { AuthRequest } from '../interfaces/auth.interface';
import { getIO } from '../utils/socketServer';
import userService from '../features/auth/services';

const router = Router();

// Use path relative to project root, not src directory
// In production (compiled), __dirname will be in dist/, so we go up two levels
// In development with ts-node, __dirname is in src/, so we go up one level
// This ensures files are saved to backend/uploads/profile-pictures/
const projectRoot = path.join(__dirname, '../../');
const uploadsDir = path.join(projectRoot, 'uploads', 'profile-pictures');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const userId = (req as AuthRequest).user?.id;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `profile-${userId}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  req: AuthRequest,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (JPEG, JPG, PNG, GIF, WEBP) are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
});

router.post(
  '/upload',
  authMiddleware,
  upload.single('profilePicture'),
  async (req: AuthRequest, res: Response) => {
    const io = getIO();
    const userId = req.user?.id;
    const uploadId = req.body.uploadId || `upload-${Date.now()}`;

    try {
      if (!req.file) {
        if (userId) {
          io.to(userId).emit('upload:error', {
            uploadId,
            error: 'No file uploaded',
          });
        }
        return res.status(400).json({ message: 'No file uploaded' });
      }

      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      // Simulate upload progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        if (progress <= 90 && userId) {
          io.to(userId).emit('upload:progress', {
            uploadId,
            progress,
            status: 'uploading',
          });
        }
      }, 100);

      // Wait a bit to simulate upload time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      clearInterval(progressInterval);

      const fileUrl = `/uploads/profile-pictures/${req.file.filename}`;

      // Update user profile picture
      await userService.updateUser(userId, { profile_picture_url: fileUrl });

      // Get updated user
      const updatedUser = await userService.findById(userId);
      if (!updatedUser) {
        throw new Error('User not found');
      }

      // Emit completion
      if (userId) {
        io.to(userId).emit('upload:progress', {
          uploadId,
          progress: 100,
          status: 'completed',
          fileUrl,
        });

        // Emit profile update event for real-time refresh
        const userPublic: UserPublic = {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          profile_picture_url: updatedUser.profile_picture_url || null,
          role: updatedUser.role || 'buyer',
          created_at: updatedUser.created_at,
        };
        io.to(userId).emit('profile:updated', { user: userPublic });
        io.to(userId).emit('user:updated', { user: userPublic });
      }

      res.json({
        message: 'Profile picture uploaded successfully',
        fileUrl,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'File upload failed';

      if (userId) {
        io.to(userId).emit('upload:error', {
          uploadId,
          error: errorMessage,
        });
      }

      // Delete file if it was uploaded but update failed
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({ message: errorMessage });
    }
  }
);

export default router;
