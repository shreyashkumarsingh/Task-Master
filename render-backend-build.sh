#!/bin/bash
echo "Starting backend deployment for Render..."

# Backup frontend package.json
echo "Backing up frontend package.json..."
mv package.json package-frontend-backup.json

# Copy backend package.json to root
echo "Setting up backend package.json..."
cp backend/package.json package.json

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Build backend
echo "Building backend..."
npm run build

echo "Backend build complete!"
