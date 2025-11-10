import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connection';

const alterPasswordColumn = async (): Promise<void> => {
  try {
    const queryInterface = sequelize.getQueryInterface();

    await queryInterface.changeColumn('users', 'password', {
      type: DataTypes.STRING,
      allowNull: true,
    });

    console.log('✅ Updated password column to allow NULL values');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to alter password column:', error);
    await sequelize.close();
    process.exit(1);
  }
};

alterPasswordColumn();
