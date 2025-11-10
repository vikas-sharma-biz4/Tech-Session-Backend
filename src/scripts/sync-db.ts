import { sequelize } from '../db/connection';

const force = process.argv.includes('--force');

sequelize
  .sync({ force })
  .then(() => {
    console.log(`✅ Database synchronized${force ? ' (all tables dropped and recreated)' : ''}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database sync failed:', error);
    process.exit(1);
  });
