# TaskMaster Deployment Guide

## Render Deployment

This project consists of two parts:
1. Frontend (React + Vite)
2. Backend (Node.js + Express)

### Backend Deployment on Render

1. Build Command: `cd backend && npm install && npm run build`
2. Start Command: `cd backend && npm start`
3. Environment Variables needed:
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend-url.onrender.com`
   - `JWT_SECRET=your-secret-key-here`
   - `JWT_EXPIRES_IN=7d`

### Frontend Deployment on Render

1. Build Command: `npm install && npm run build`
2. Publish Directory: `dist`
3. Environment Variables needed:
   - `VITE_API_BASE_URL=https://your-backend-url.onrender.com`

## Local Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
npm install
npm run dev
```
