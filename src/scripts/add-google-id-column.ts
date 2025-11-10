import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connection';

const addGoogleIdColumn = async (): Promise<void> => {
  try {
    const queryInterface = sequelize.getQueryInterface();

    const tableDescription = await queryInterface.describeTable('users');

    if (!tableDescription.google_id) {
      await queryInterface.addColumn('users', 'google_id', {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      });
      console.log('✅ Added google_id column to users table');
    } else {
      console.log('ℹ️  google_id column already exists');
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to add google_id column:', error);
    await sequelize.close();
    process.exit(1);
  }
};

addGoogleIdColumn();
