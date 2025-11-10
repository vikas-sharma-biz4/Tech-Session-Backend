import { DataTypes, DataType } from 'sequelize';
import { sequelize } from '../db/connection';

interface ColumnDefinition {
  type: DataType;
  allowNull: boolean;
  unique?: boolean;
}

const addAllMissingColumns = async (): Promise<void> => {
  try {
    const queryInterface = sequelize.getQueryInterface();

    const tableDescription = await queryInterface.describeTable('users');
    const columnsToAdd: Array<{ name: string; definition: ColumnDefinition }> = [];

    if (!tableDescription.reset_token) {
      columnsToAdd.push({
        name: 'reset_token',
        definition: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      });
    }

    if (!tableDescription.reset_token_expiry) {
      columnsToAdd.push({
        name: 'reset_token_expiry',
        definition: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      });
    }

    if (!tableDescription.otp) {
      columnsToAdd.push({
        name: 'otp',
        definition: {
          type: DataTypes.STRING(6),
          allowNull: true,
        },
      });
    }

    if (!tableDescription.otp_expiry) {
      columnsToAdd.push({
        name: 'otp_expiry',
        definition: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      });
    }

    if (!tableDescription.google_id) {
      columnsToAdd.push({
        name: 'google_id',
        definition: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true,
        },
      });
    }

    if (columnsToAdd.length === 0) {
      console.log('✅ All required columns already exist in users table');
    } else {
      for (const column of columnsToAdd) {
        await queryInterface.addColumn('users', column.name, column.definition);
        console.log(`✅ Added ${column.name} column to users table`);
      }
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to add missing columns:', error);
    await sequelize.close();
    process.exit(1);
  }
};

addAllMissingColumns();
