#!/bin/bash
echo "TaskMaster Backend Deployment Script"
echo "Current directory: $(pwd)"
echo "Contents:"
ls -la

echo "Changing to backend directory..."
cd backend

echo "Backend directory contents:"
ls -la

echo "Installing dependencies..."
npm install

echo "Building TypeScript..."
npm run build

echo "Checking dist directory..."
ls -la dist

echo "Starting server..."
npm start
