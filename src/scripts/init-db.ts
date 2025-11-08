import { sequelize, testConnection } from '../db/connection';

const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('🔄 Initializing database...');
    await testConnection();
    console.log('🔄 Syncing database tables...');
    await sequelize.sync({ force: false });
    console.log('✅ Database initialized successfully');
    console.log('📊 Tables created/verified:');
    console.log('   - users');
    await sequelize.close();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  initializeDatabase();
}

export default initializeDatabase;
