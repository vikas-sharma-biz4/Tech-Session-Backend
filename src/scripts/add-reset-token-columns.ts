import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connection';

const addResetTokenColumns = async (): Promise<void> => {
  try {
    const queryInterface = sequelize.getQueryInterface();

    const tableDescription = await queryInterface.describeTable('users');

    if (!tableDescription.reset_token) {
      await queryInterface.addColumn('users', 'reset_token', {
        type: DataTypes.STRING,
        allowNull: true,
      });
      console.log('✅ Added reset_token column to users table');
    } else {
      console.log('ℹ️  reset_token column already exists');
    }

    if (!tableDescription.reset_token_expiry) {
      await queryInterface.addColumn('users', 'reset_token_expiry', {
        type: DataTypes.DATE,
        allowNull: true,
      });
      console.log('✅ Added reset_token_expiry column to users table');
    } else {
      console.log('ℹ️  reset_token_expiry column already exists');
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to add reset token columns:', error);
    await sequelize.close();
    process.exit(1);
  }
};

addResetTokenColumns();
