import { envConfig } from './envConfig';

export const settings = {
  app: {
    name: envConfig.APP_NAME,
    port: envConfig.PORT,
    env: envConfig.NODE_ENV,
  },
  jwt: {
    secret: envConfig.JWT_SECRET,
    expiresIn: '7d',
  },
  database: {
    username: envConfig.DB_USER,
    password: envConfig.DB_PASSWORD,
    database: envConfig.DB_NAME,
    host: envConfig.DB_HOST,
    port: envConfig.DB_PORT,
    dialect: 'postgres' as const,
    logging: envConfig.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: envConfig.NODE_ENV === 'production' ? 20 : 5,
      min: envConfig.NODE_ENV === 'production' ? 5 : 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  email: {
    host: envConfig.EMAIL_HOST,
    port: envConfig.EMAIL_PORT,
    secure: envConfig.EMAIL_SECURE,
    auth: {
      user: envConfig.EMAIL_USER,
      pass: envConfig.EMAIL_PASSWORD,
    },
    from: {
      name: envConfig.APP_NAME,
      address: envConfig.EMAIL_USER || 'noreply@example.com',
    },
  },
  google: {
    clientId: envConfig.GOOGLE_CLIENT_ID,
    clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
    callbackUrl: envConfig.GOOGLE_CALLBACK_URL,
  },
  frontend: {
    url: envConfig.FRONTEND_URL,
  },
};

