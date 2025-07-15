#!/bin/bash
echo "Starting frontend build..."
echo "Copying frontend package.json..."
cp package-frontend.json package.json
echo "Installing dependencies..."
npm install
echo "Building frontend..."
npm run build
echo "Frontend build complete!"
