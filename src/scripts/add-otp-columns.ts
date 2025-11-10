import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connection';

const addOTPColumns = async (): Promise<void> => {
  try {
    const queryInterface = sequelize.getQueryInterface();

    const tableDescription = await queryInterface.describeTable('users');

    if (!tableDescription.otp) {
      await queryInterface.addColumn('users', 'otp', {
        type: DataTypes.STRING(6),
        allowNull: true,
      });
      console.log('✅ Added otp column to users table');
    } else {
      console.log('ℹ️  otp column already exists');
    }

    if (!tableDescription.otp_expiry) {
      await queryInterface.addColumn('users', 'otp_expiry', {
        type: DataTypes.DATE,
        allowNull: true,
      });
      console.log('✅ Added otp_expiry column to users table');
    } else {
      console.log('ℹ️  otp_expiry column already exists');
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to add OTP columns:', error);
    await sequelize.close();
    process.exit(1);
  }
};

addOTPColumns();
