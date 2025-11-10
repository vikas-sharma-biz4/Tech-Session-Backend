import { sequelize } from '../db/connection';
import '../models/FileModel';

const createFilesTable = async (): Promise<void> => {
  try {
    await sequelize.sync({ force: false });
    console.log('✅ Files table created/verified');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create files table:', error);
    await sequelize.close();
    process.exit(1);
  }
};

createFilesTable();
