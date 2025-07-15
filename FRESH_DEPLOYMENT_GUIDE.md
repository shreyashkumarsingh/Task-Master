# Complete Vercel Deployment Guide - TaskMaster

## 🚀 Step-by-Step Fresh Deployment Guide

### IMPORTANT: Deploy Backend FIRST, then Frontend!

---

## PART 1: Deploy Backend to Vercel

### Step 1: Go to Vercel Dashboard
1. Open your browser
2. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
3. Log in to your Vercel account

### Step 2: Create New Project for Backend
1. Click **"Add New..."** button (top right)
2. Select **"Project"**
3. You'll see "Import Git Repository" section

### Step 3: Import Your Repository
1. Find your `Task-Master` repository in the list
2. Click **"Import"** next to it
3. You'll be taken to the project configuration page

### Step 4: Configure Backend Settings (CRITICAL STEP!)
**⚠️ This is the most important step:**

1. **Project Name**: Change it to something like `taskmaster-backend` or `task-master-api`
2. **Root Directory**: 
   - Click on **"Edit"** next to Root Directory
   - Type: `backend`
   - This tells Vercel to deploy only the backend folder

### Step 5: Add Environment Variables for Backend
Click **"Environment Variables"** and add these:

```
Variable Name: NODE_ENV
Value: production

Variable Name: JWT_SECRET  
Value: your-super-secure-jwt-secret-key-minimum-32-characters-long-change-this

Variable Name: JWT_EXPIRES_IN
Value: 7d

Variable Name: FRONTEND_URL
Value: https://taskmaster-frontend.vercel.app
```

**Note**: The FRONTEND_URL is a placeholder - we'll update it after frontend deployment.

### Step 6: Deploy Backend
1. Click **"Deploy"**
2. Wait for deployment (usually 1-3 minutes)
3. **COPY THE BACKEND URL** that appears (e.g., `https://taskmaster-backend.vercel.app`)
4. **Test it**: Visit the URL - you should see "TaskMaster Backend is running!"

---

## PART 2: Deploy Frontend to Vercel

### Step 7: Create New Project for Frontend
1. Go back to Vercel dashboard
2. Click **"Add New..."** → **"Project"** again
3. Import the same `Task-Master` repository

### Step 8: Configure Frontend Settings
1. **Project Name**: Change it to something like `taskmaster-frontend` or `task-master-app`
2. **Root Directory**: Leave this as **"."** (dot) or empty - this deploys the frontend

### Step 9: Add Environment Variables for Frontend
Click **"Environment Variables"** and add:

```
Variable Name: VITE_API_BASE_URL
Value: [YOUR BACKEND URL FROM STEP 6]
```

**Example**: If your backend URL is `https://taskmaster-backend.vercel.app`, then:
```
VITE_API_BASE_URL=https://taskmaster-backend.vercel.app
```

### Step 10: Deploy Frontend
1. Click **"Deploy"**
2. Wait for deployment
3. **COPY THE FRONTEND URL** that appears

---

## PART 3: Update Backend with Frontend URL

### Step 11: Update Backend Environment Variables
1. Go to your **backend project** in Vercel dashboard
2. Go to **"Settings"** → **"Environment Variables"**
3. Find the `FRONTEND_URL` variable
4. Update its value with your actual frontend URL
5. Click **"Save"**
6. **Redeploy** the backend (go to Deployments tab and click "Redeploy")

---

## PART 4: Update Your Local Environment File

### Step 12: Update .env.production
Now update your local `.env.production` file with the actual backend URL:

```bash
# Production Environment Variables
VITE_API_BASE_URL=https://your-actual-backend-url.vercel.app
```

### Step 13: Commit and Push Changes
```bash
git add .env.production
git commit -m "Update production environment variables"
git push origin main
```

This will trigger an automatic redeployment of your frontend with the correct URL.

---

## 🧪 Testing Your Deployment

### Test Backend
1. Visit your backend URL: `https://your-backend-url.vercel.app`
2. Should show: "TaskMaster Backend is running!"
3. Test API: `https://your-backend-url.vercel.app/api/auth/login`
4. Should show an error message (this is normal - means API is working)

### Test Frontend
1. Visit your frontend URL
2. Try to register a new account
3. Try to login
4. Should redirect to dashboard after successful authentication

---

## 📝 Example Final URLs

After deployment, you should have:
- **Backend**: `https://taskmaster-backend.vercel.app`
- **Frontend**: `https://taskmaster-frontend.vercel.app`

---

## 🔧 Troubleshooting Common Issues

### Backend Issues
**"404 Not Found"**
- Check if Root Directory is set to `backend`
- Check deployment logs in Vercel

**"Internal Server Error"**
- Check environment variables are set correctly
- Check Vercel function logs

### Frontend Issues
**"Failed to fetch" errors**
- Check if `VITE_API_BASE_URL` is set correctly
- Check if backend URL is accessible
- Check browser console for CORS errors

**Build errors**
- Check if all dependencies are in `package.json`
- Check build logs in Vercel

---

## 🎯 Quick Checklist

- [ ] Backend deployed with Root Directory = `backend`
- [ ] Backend environment variables added
- [ ] Backend URL copied and tested
- [ ] Frontend deployed with Root Directory = `.` or empty
- [ ] Frontend environment variable `VITE_API_BASE_URL` set to backend URL
- [ ] Backend `FRONTEND_URL` updated with frontend URL
- [ ] Both deployments tested
- [ ] Authentication works end-to-end

---

## 📞 Need Help?

If you run into issues:
1. Share the error message you're seeing
2. Share your Vercel project URLs
3. Check the browser console (F12) for errors
4. Check Vercel deployment logs

Let me know at which step you need assistance!
