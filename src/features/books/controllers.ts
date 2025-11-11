import { Response } from 'express';
import { AuthRequest } from '../../interfaces/auth.interface';
import bookService from './services';
import { ApiResponse } from '../../types';

export const getBooks = async (req: AuthRequest, res: Response<ApiResponse>): Promise<void> => {
  try {
    const { type, search, condition, minPrice, maxPrice, sortBy, sortOrder, page, limit } =
      req.query;

    const filters = {
      type: type as string | undefined,
      search: search as string | undefined,
      condition: condition as string | undefined,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      sortBy: sortBy as string | undefined,
      sortOrder: (sortOrder as 'ASC' | 'DESC') || undefined,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20,
    };

    const result = await bookService.getBooks(filters);

    res.json({
      message: 'Books retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBookById = async (req: AuthRequest, res: Response<ApiResponse>): Promise<void> => {
  try {
    const { id } = req.params;
    const book = await bookService.getBookById(id);

    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    res.json({
      message: 'Book retrieved successfully',
      data: book,
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createBook = async (req: AuthRequest, res: Response<ApiResponse>): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const book = await bookService.createBook({
      ...req.body,
      seller_id: userId,
    });

    res.status(201).json({
      message: 'Book created successfully',
      data: book,
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBook = async (req: AuthRequest, res: Response<ApiResponse>): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const book = await bookService.updateBook(id, userId, req.body);

    if (!book) {
      res
        .status(404)
        .json({ message: 'Book not found or you do not have permission to update it' });
      return;
    }

    res.json({
      message: 'Book updated successfully',
      data: book,
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBook = async (req: AuthRequest, res: Response<ApiResponse>): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const deleted = await bookService.deleteBook(id, userId);

    if (!deleted) {
      res
        .status(404)
        .json({ message: 'Book not found or you do not have permission to delete it' });
      return;
    }

    res.json({
      message: 'Book deleted successfully',
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyBooks = async (req: AuthRequest, res: Response<ApiResponse>): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { page, limit, type, condition, search, minPrice, maxPrice, sortBy, sortOrder } =
      req.query;
    const pageNum = page ? parseInt(page as string, 10) : 1;
    const limitNum = limit ? parseInt(limit as string, 10) : 1000;

    const filters = {
      page: pageNum,
      limit: limitNum,
      type: type as string | undefined,
      condition: condition as string | undefined,
      search: search as string | undefined,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      sortBy: sortBy as string | undefined,
      sortOrder: (sortOrder as 'ASC' | 'DESC') || undefined,
    };

    const result = await bookService.getMyBooks(userId, filters);

    res.json({
      message: 'Your books retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.error('Get my books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
