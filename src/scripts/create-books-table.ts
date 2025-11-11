import { sequelize, testConnection } from '../db/connection';
// @ts-ignore - Import models to register them
import '../features/books/models/BookModel';
// @ts-ignore - Import models to register them
import '../features/auth/models/UserModel';

const createBooksTable = async (): Promise<void> => {
  try {
    await testConnection();

    // Sync all models to create/update tables
    await sequelize.sync({ force: false, alter: true });

    console.log('✅ Books table created/updated successfully');
    console.log('📦 Table name: books');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating books table:', error);
    await sequelize.close();
    process.exit(1);
  }
};

createBooksTable();
