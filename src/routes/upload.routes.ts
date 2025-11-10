import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authMiddleware } from '../middlewares/authMiddleware';
import { AuthRequest } from '../interfaces/auth.interface';
import { getIO } from '../socket/socketServer';
import File from '../models/FileModel';

const router = Router();

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and documents are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: fileFilter,
});

router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const io = getIO();
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      const fileRecord = await File.create({
        userId: userId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
      });

      if (userId) {
        io.to(userId).emit('upload:progress', {
          uploadId: req.body.uploadId || 'default',
          progress: 100,
          status: 'completed',
        });
      }

      res.json({
        message: 'File uploaded successfully',
        file: {
          id: fileRecord.id,
          filename: fileRecord.filename,
          originalName: fileRecord.originalName,
          mimeType: fileRecord.mimeType,
          size: fileRecord.size,
          url: fileRecord.url,
        },
      });
    } catch (error) {
      const io = getIO();
      const userId = req.user?.id;

      if (userId) {
        io.to(userId).emit('upload:error', {
          uploadId: req.body.uploadId || 'default',
          error: 'File upload failed',
        });
      }
      res.status(500).json({ message: 'File upload failed' });
    }
  }
);

router.get('/files', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const files = await File.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
    });

    res.json({
      files: files.map((file) => ({
        id: file.id,
        filename: file.filename,
        originalName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
        url: file.url,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch files' });
  }
});

export default router;
