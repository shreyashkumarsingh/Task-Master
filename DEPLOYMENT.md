# TaskMaster - Full Stack Task Management Application

A modern, full-stack task management application built with React, TypeScript, Node.js, and Express.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **User-specific Data**: Each user sees only their own tasks
- **Categories**: Organize tasks with custom categories
- **Priority Levels**: Set task priorities (low, medium, high)
- **Due Dates & Times**: Schedule tasks with due dates and times
- **Progress Tracking**: Monitor completion rates and statistics
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **Context API** for state management

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **JWT** for authentication
- **bcryptjs** for password hashing
- **JSON file** for data storage (easily replaceable with a database)

## Development Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Frontend Setup
1. Navigate to the project root
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` file:
   ```
   VITE_API_BASE_URL=http://localhost:4000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `.env` file with your settings:
   ```
   NODE_ENV=development
   PORT=4000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minimum-32-characters
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:8081
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment to Vercel

### Backend Deployment
1. Create a new Vercel project for the backend
2. Connect your repository
3. Set the root directory to `backend`
4. Add environment variables in Vercel dashboard:
   - `JWT_SECRET`: A secure random string (minimum 32 characters)
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your frontend URL (will be set after frontend deployment)

### Frontend Deployment
1. Create a new Vercel project for the frontend
2. Connect your repository
3. Set the root directory to the project root (not backend)
4. Add environment variable in Vercel dashboard:
   - `VITE_API_BASE_URL`: Your backend URL from the backend deployment
5. Update the backend's `FRONTEND_URL` environment variable with your frontend URL

### Important Notes for Production

1. **Change JWT Secret**: Use a secure, randomly generated secret key for JWT signing
2. **Update API URLs**: Replace placeholder URLs with your actual Vercel deployment URLs
3. **Database Migration**: Consider migrating from JSON file storage to a proper database like MongoDB, PostgreSQL, or Supabase for production use

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Users
- `GET /api/users/profile` - Get user profile

## File Structure

```
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   └── db.ts           # Database operations
│   │   ├── middleware/
│   │   │   └── auth.ts         # Authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.ts         # Authentication routes
│   │   │   ├── tasks.ts        # Task routes
│   │   │   └── users.ts        # User routes
│   │   ├── utils/
│   │   │   └── auth.ts         # Authentication utilities
│   │   └── index.ts            # Server entry point
│   ├── data/
│   │   └── database.json       # JSON database file
│   ├── vercel.json             # Vercel config for backend
│   └── package.json
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── AuthLayout.tsx      # Authentication layout
│   │   └── MainLayout.tsx      # Main application layout
│   ├── contexts/
│   │   ├── AuthContext.tsx     # Authentication context
│   │   ├── TaskContext.tsx     # Task management context
│   │   └── ThemeContext.tsx    # Theme context
│   ├── pages/
│   │   ├── Dashboard.tsx       # Dashboard page
│   │   ├── Tasks.tsx          # Tasks page
│   │   ├── Calendar.tsx       # Calendar page
│   │   ├── Login.tsx          # Login page
│   │   └── Register.tsx       # Register page
│   ├── services/
│   │   └── api.ts             # API service functions
│   └── App.tsx                # Main app component
├── vercel.json                # Vercel config for frontend
└── package.json
```

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For support, please open an issue in the GitHub repository.
