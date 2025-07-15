# TaskMaster - Personal Task Management

A modern, full-stack task management application built with React, TypeScript, and Node.js. Organize your tasks, track your progress, and boost your productivity with TaskMaster's intuitive interface and powerful features.



## ✨ Features

- **🔐 Secure Authentication** - JWT-based user registration and login
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices
- **🎨 Dark/Light Theme** - Toggle between themes for comfortable viewing
- **📊 Dashboard Overview** - Visual task statistics and progress tracking
- **✅ Task Management** - Create, edit, delete, and organize your tasks
- **📅 Calendar View** - See your tasks in an organized calendar layout
- **⚡ Real-time Updates** - Instant task status updates
- **🏷️ Task Priority** - Set priority levels (Low, Medium, High, Urgent)
- **📝 Rich Task Details** - Add descriptions and due dates to tasks

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/UI** for beautiful components
- **React Router** for navigation
- **Lucide React** for icons
- **React Hook Form** for form management

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests
- **JSON file storage** (easily replaceable with database)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/shreyashkumarsingh/agenda-vista-project.git
cd agenda-vista-project
```

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:8080` and the backend on `http://localhost:4000`.

## 🏗️ Project Structure

```
taskmaster/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── AuthLayout.tsx # Authentication layout
│   │   └── MainLayout.tsx # Main application layout
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── TaskContext.tsx
│   │   └── ThemeContext.tsx
│   ├── pages/             # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Tasks.tsx
│   │   ├── Calendar.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility functions
├── backend/               # Backend source code
│   ├── src/
│   │   ├── routes/        # API routes
│   │   │   ├── auth.ts    # Authentication routes
│   │   │   ├── tasks.ts   # Task management routes
│   │   │   └── users.ts   # User management routes
│   │   ├── utils/         # Backend utilities
│   │   └── index.ts       # Express server setup
│   └── data/              # JSON data storage
└── public/                # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Tasks
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Users
- `GET /api/users/profile` - Get user profile

## 🎯 Usage

1. **Register/Login** - Create an account or sign in
2. **Dashboard** - View your task overview and statistics
3. **Add Tasks** - Click the "+" button to create new tasks
4. **Manage Tasks** - Edit, delete, or mark tasks as complete
5. **Calendar View** - Switch to calendar view to see tasks by date
6. **Theme Toggle** - Use the sun/moon icon to switch themes

## 🚀 Deployment

### Deploy to Vercel

1. **Frontend Deployment**
   ```bash
   npm run build
   vercel --prod
   ```

2. **Backend Deployment**
   ```bash
   cd backend
   npm run build
   vercel --prod
   ```

### Environment Variables

Create `.env` files for both frontend and backend:

**Frontend (.env)**
```
VITE_API_URL=https://your-backend-url.vercel.app
```

**Backend (.env)**
```
JWT_SECRET=your-super-secure-jwt-secret-key
PORT=4000
```

## 🛠️ Development

### Available Scripts

**Frontend**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Start production server

### Code Style
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Lucide](https://lucide.dev/) for icon library
- [Tailwind CSS](https://tailwindcss.com/) for styling framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ by Shreyash Kumar Singh**

