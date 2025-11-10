import { Sequelize } from 'sequelize';
import { settings } from '../config/settings';

const sequelize = new Sequelize(
  settings.database.database,
  settings.database.username,
  settings.database.password,
  {
    host: settings.database.host,
    port: settings.database.port,
    dialect: settings.database.dialect,
    logging: settings.database.logging,
    pool: settings.database.pool,
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Unable to connect to the database:', errorMessage);
    console.error('Please check your database configuration and ensure PostgreSQL is running');
    throw error;
  }
};

export { sequelize };
