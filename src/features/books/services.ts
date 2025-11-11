import { Op } from 'sequelize';
import Book from './models/BookModel';
import User from '../auth/models/UserModel';

// Define association
Book.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });

interface BookFilters {
  type?: string;
  search?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

interface BookListResponse {
  books: Book[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class BookService {
  async createBook(data: {
    title: string;
    author: string;
    isbn?: string;
    type: string;
    price: number;
    description?: string;
    seller_id: string;
    condition: string;
    image_url?: string;
  }): Promise<Book> {
    return await Book.create(data);
  }

  async getBooks(filters: BookFilters = {}): Promise<BookListResponse> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (filters.type && filters.type !== 'all') {
      where.type = filters.type;
    }

    if (filters.condition && filters.condition !== 'all') {
      where.condition = filters.condition;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const priceFilter: Record<string, unknown> = {};
      if (filters.minPrice !== undefined) {
        priceFilter[Op.gte] = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        priceFilter[Op.lte] = filters.maxPrice;
      }
      where.price = priceFilter;
    }

    if (filters.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${filters.search}%` } },
        { author: { [Op.iLike]: `%${filters.search}%` } },
        { isbn: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    // Determine sort order
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'DESC';
    const order: [string, 'ASC' | 'DESC'] = [[sortBy, sortOrder]];

    const { count, rows } = await Book.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email'],
        },
      ],
      limit,
      offset,
      order,
    });

    return {
      books: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getBookById(id: string): Promise<Book | null> {
    return await Book.findByPk(id, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
  }

  async getMyBooks(sellerId: string, filters: BookFilters = {}): Promise<BookListResponse> {
    const page = filters.page || 1;
    const limit = filters.limit || 1000;
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {
      seller_id: sellerId,
    };

    if (filters.type && filters.type !== 'all') {
      where.type = filters.type;
    }

    if (filters.condition && filters.condition !== 'all') {
      where.condition = filters.condition;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const priceFilter: Record<string, unknown> = {};
      if (filters.minPrice !== undefined) {
        priceFilter[Op.gte] = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        priceFilter[Op.lte] = filters.maxPrice;
      }
      where.price = priceFilter;
    }

    if (filters.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${filters.search}%` } },
        { author: { [Op.iLike]: `%${filters.search}%` } },
        { isbn: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    // Determine sort order
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'DESC';
    const order: [string, 'ASC' | 'DESC'] = [[sortBy, sortOrder]];

    const { count, rows } = await Book.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email'],
        },
      ],
      limit,
      offset,
      order,
    });

    return {
      books: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async updateBook(id: string, sellerId: string, data: Partial<Book>): Promise<Book | null> {
    const book = await Book.findOne({ where: { id, seller_id: sellerId } });
    if (!book) {
      return null;
    }
    await book.update(data);
    return book;
  }

  async deleteBook(id: string, sellerId: string): Promise<boolean> {
    const book = await Book.findOne({ where: { id, seller_id: sellerId } });
    if (!book) {
      return false;
    }
    await book.destroy();
    return true;
  }
}

export default new BookService();
