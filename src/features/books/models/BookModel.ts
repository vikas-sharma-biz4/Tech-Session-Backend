import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../db/connection';

interface BookAttributes {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  type: 'fiction' | 'non-fiction' | 'academic' | 'biography' | 'other';
  price: number;
  description?: string;
  seller_id: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}

interface BookCreationAttributes
  extends Optional<
    BookAttributes,
    'id' | 'created_at' | 'updated_at' | 'isbn' | 'description' | 'image_url'
  > {}

class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
  public id!: string;
  public title!: string;
  public author!: string;
  public isbn?: string;
  public type!: 'fiction' | 'non-fiction' | 'academic' | 'biography' | 'other';
  public price!: number;
  public description?: string;
  public seller_id!: string;
  public condition!: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  public image_url?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Book.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('fiction', 'non-fiction', 'academic', 'biography', 'other'),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    seller_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    condition: {
      type: DataTypes.ENUM('new', 'like-new', 'good', 'fair', 'poor'),
      allowNull: false,
      defaultValue: 'good',
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'books',
    timestamps: true,
    underscored: true,
  }
);

export default Book;
