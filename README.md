# Auth Module - Backend

A robust authentication backend API built with Express.js, TypeScript, PostgreSQL, and Nodemailer.

## 🚀 Features

- ✅ User Registration with OTP Verification
- ✅ User Login
- ✅ Google OAuth Authentication
- ✅ Password Reset with OTP
- ✅ JWT-based Authentication
- ✅ Email Verification (Mario-themed HTML templates)
- ✅ PostgreSQL Database with Sequelize ORM
- ✅ TypeScript Support
- ✅ Input Validation with Joi
- ✅ Secure Password Hashing with Bcrypt

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create Environment File**
   
   Create a `.env` file in the `backend/` directory:
   ```env
   # Server
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-in-production

   # Database
   DB_USER=postgres
   DB_PASSWORD=your-db-password
   DB_NAME=auth_module_dev
   DB_HOST=localhost
   DB_PORT=5432

   # Email (Gmail example)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   APP_NAME=Auth Module

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   FRONTEND_URL=http://localhost:3000
   ```

3. **Database Setup**
   
   Create a PostgreSQL database:
   ```sql
   CREATE DATABASE auth_module_dev;
   ```
   
   Or use the init script:
   ```bash
   npm run db:init
   ```

4. **Database Migration**
   
   Sync the database schema:
   ```bash
   npm run db:sync
   ```
   
   Add Google OAuth support (if using Google OAuth):
   ```bash
   npm run db:migrate
   npm run db:alter-password
   ```

## 🎮 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration (sends OTP)
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/verify-signup-otp` - Verify signup OTP
  ```json
  {
    "email": "john@example.com",
    "otp": "123456"
  }
  ```

- `POST /api/auth/login` - User login
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

- `POST /api/auth/forgot-password` - Request password reset OTP
  ```json
  {
    "email": "john@example.com"
  }
  ```

- `POST /api/auth/verify-otp` - Verify OTP
  ```json
  {
    "email": "john@example.com",
    "otp": "123456"
  }
  ```

- `POST /api/auth/reset-password-otp` - Reset password with OTP
  ```json
  {
    "email": "john@example.com",
    "otp": "123456",
    "password": "newpassword123"
  }
  ```

### User (Protected Routes)

- `GET /api/user/profile` - Get user profile (requires JWT token)

### Health Check

- `GET /api/health` - Server health check

## 🔐 Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📧 Email Configuration

### Gmail Setup

1. Enable 2-Step Verification on your Google account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Create an app password for "Mail"
   - Use this password in `EMAIL_PASSWORD`

### Email Templates

All emails use Mario-themed HTML templates:
- 🍄 Password Reset OTP Email
- ⭐ Signup Verification OTP Email
- 🎊 Welcome Email (after successful verification)

## 🗄️ Database Scripts

- `npm run db:init` - Initialize database connection
- `npm run db:sync` - Sync database schema (creates tables)
- `npm run db:reset` - Reset database (drops and recreates tables)
- `npm run db:migrate` - Add Google OAuth column
- `npm run db:alter-password` - Make password column nullable for OAuth users

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── App.ts                 # Application entry point
│   ├── config/
│   │   ├── envConfig.ts      # Environment configuration
│   │   ├── passport.ts        # Google OAuth Passport strategy
│   │   └── settings.ts        # Application settings
│   ├── db/
│   │   └── connection.ts      # Sequelize database connection
│   ├── features/
│   │   └── auth/
│   │       ├── controllers.ts # Auth controllers
│   │       ├── routes.ts       # Auth routes
│   │       ├── services.ts     # Business logic
│   │       ├── validations.ts  # Joi validation schemas
│   │       └── models/
│   │           └── UserModel.ts # Sequelize User model
│   ├── interfaces/
│   │   └── auth.interface.ts  # TypeScript interfaces
│   ├── middlewares/
│   │   ├── authMiddleware.ts  # JWT authentication middleware
│   │   └── validationMiddleware.ts # Request validation middleware
│   ├── routes/
│   │   └── user.routes.ts     # User routes
│   ├── scripts/
│   │   ├── init-db.ts         # Database initialization
│   │   ├── sync-db.ts         # Database synchronization
│   │   ├── add-google-id-column.ts # Google OAuth migration
│   │   └── alter-password-column.ts # Password column migration
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   └── utils/
│       ├── constants.ts       # Application constants
│       └── emailService.ts    # Email service with Mario-themed templates
├── package.json
└── tsconfig.json
```

## 🔧 Technologies Used

- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Relational database
- **Sequelize** - ORM for PostgreSQL
- **JWT** - JSON Web Tokens for authentication
- **Bcryptjs** - Password hashing
- **Nodemailer** - Email sending
- **Passport.js** - Authentication middleware
- **Passport Google OAuth20** - Google OAuth strategy
- **Joi** - Request validation
- **dotenv** - Environment variable management

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `5000` |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `DB_USER` | PostgreSQL username | Yes | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | Yes | - |
| `DB_NAME` | Database name | Yes | `auth_module_dev` |
| `DB_HOST` | Database host | No | `localhost` |
| `DB_PORT` | Database port | No | `5432` |
| `EMAIL_HOST` | SMTP host | Yes | - |
| `EMAIL_PORT` | SMTP port | Yes | `587` |
| `EMAIL_SECURE` | Use SSL/TLS | No | `false` |
| `EMAIL_USER` | Email username | Yes | - |
| `EMAIL_PASSWORD` | Email password/app password | Yes | - |
| `APP_NAME` | Application name | No | `Auth Module` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Optional | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Optional | - |
| `GOOGLE_CALLBACK_URL` | OAuth callback URL | Optional | `http://localhost:5000/api/auth/google/callback` |
| `FRONTEND_URL` | Frontend URL for redirects | Optional | `http://localhost:3000` |

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify database credentials in `.env`
- Check if database exists: `psql -U postgres -l`

### Email Not Sending
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- For Gmail, use App Password (not regular password)
- Check backend logs for email errors

### Google OAuth Not Working
- Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Verify callback URL matches Google Cloud Console settings
- Run database migrations: `npm run db:migrate` and `npm run db:alter-password`

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

## 📄 License

MIT License

## 👨‍💻 Author

Vikas Sharma

