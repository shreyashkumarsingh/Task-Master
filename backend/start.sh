#!/bin/bash
echo "Starting TaskMaster Backend..."
echo "Current directory: $(pwd)"
echo "Listing files in dist:"
ls -la dist/ || echo "dist directory not found"
echo "Starting server..."
node dist/index.js
