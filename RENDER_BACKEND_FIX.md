# Render Backend Deployment Guide

## Current Issue
The deployment is failing because Render is trying to build the frontend instead of the backend. 

## Solution

### 1. Repository Configuration
The root `package.json` has been updated to be backend-focused for Render deployment.

### 2. Render Service Configuration
Use these settings when creating your Render service:

**Service Type:** Web Service
**Build Command:** `cd backend && npm install && npm run build`
**Start Command:** `cd backend && npm start`
**Environment:** Node
**Node Version:** 18.x or higher

### 3. Environment Variables
Set these in your Render dashboard:

```
NODE_ENV=production
PORT=10000
```

### 4. Alternative: Use render.yaml
The `render.yaml` file has been created in the root directory. You can use this for Infrastructure as Code deployment.

### 5. Manual Deployment Steps

If the above doesn't work, try this approach:

1. Create a new Render service
2. Connect your GitHub repository
3. Choose "Web Service"
4. Set these configurations:
   - **Root Directory:** `./backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node

### 6. Troubleshooting

If you still get frontend build errors:
1. Make sure the Render service is pointing to the `backend` directory
2. Or, temporarily rename the root `package.json` to `package-frontend.json` and copy `backend/package.json` to the root

### 7. After Backend Deployment

Once the backend is deployed:
1. Note down the backend URL (e.g., https://your-app.onrender.com)
2. Update the frontend `.env` file with the new backend URL
3. Deploy the frontend separately on Vercel or Netlify

## Files Modified for Deployment

- ✅ Created `render.yaml`
- ✅ Updated root `package.json` for backend deployment
- ✅ Saved original frontend package.json as `package-frontend.json`
