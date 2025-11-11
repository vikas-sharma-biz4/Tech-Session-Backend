import { sequelize, testConnection } from '../db/connection';

const addRoleColumn = async (): Promise<void> => {
  try {
    await testConnection();

    // Check if role column already exists
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='role'
    `);

    if (Array.isArray(results) && results.length > 0) {
      console.log('✅ Role column already exists');
      await sequelize.close();
      process.exit(0);
    }

    // Add role column with default value
    await sequelize.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'enum_users_role'
        ) THEN
          CREATE TYPE enum_users_role AS ENUM ('buyer', 'seller', 'admin');
        END IF;
      END $$;
    `);

    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS role enum_users_role NOT NULL DEFAULT 'buyer';
    `);

    // Update existing users to have 'buyer' role if they don't have one
    await sequelize.query(`
      UPDATE users 
      SET role = 'buyer' 
      WHERE role IS NULL;
    `);

    console.log('✅ Role column added successfully');
    console.log('📦 Column: role (ENUM: buyer, seller, admin)');
    console.log('📝 Default value: buyer');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding role column:', error);
    await sequelize.close();
    process.exit(1);
  }
};

addRoleColumn();
