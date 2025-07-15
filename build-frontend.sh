#!/bin/bash
echo "Starting frontend build..."
echo "Backing up current package.json..."
mv package.json package-backend-temp.json
echo "Copying frontend package.json..."
cp package-frontend.json package.json
echo "Installing dependencies..."
npm install
echo "Building frontend..."
npm run build
echo "Restoring backend package.json..."
mv package-backend-temp.json package.json
echo "Frontend build complete!"
