import { Router } from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getMyBooks,
} from './controllers';
import { requireRole } from '../../middlewares/roleMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/', getBooks);
router.get('/:id', getBookById);

// Protected routes (require authentication and seller role)
router.post('/', authMiddleware, requireRole('seller', 'admin'), createBook);
router.get('/seller/my-books', authMiddleware, requireRole('seller', 'admin'), getMyBooks);
router.put('/:id', authMiddleware, requireRole('seller', 'admin'), updateBook);
router.delete('/:id', authMiddleware, requireRole('seller', 'admin'), deleteBook);

export default router;
