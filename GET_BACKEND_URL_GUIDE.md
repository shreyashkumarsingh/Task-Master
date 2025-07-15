# Step-by-Step Guide: Get Your Backend URL from Vercel

## Method 1: If You Already Have a Backend Deployed

### Step 1: Go to Vercel Dashboard
1. Open your web browser
2. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
3. Log in with your account

### Step 2: Find Your Backend Project
1. Look for a project that contains your backend code
2. It might be named something like:
   - `task-master-backend`
   - `taskmaster-api`
   - `backend`
   - Or similar backend-related name

### Step 3: Click on Your Backend Project
1. Click on the backend project name
2. This will take you to the project overview page

### Step 4: Get the URL
1. You'll see a section called **"Deployments"** or **"Production Deployment"**
2. Look for the **"Visit"** button or a URL that looks like:
   - `https://your-project-name.vercel.app`
   - `https://your-project-name-xyz123.vercel.app`
3. Copy this URL - this is your backend URL!

### Step 5: Test the Backend URL
1. Open a new browser tab
2. Paste your backend URL
3. You should see a message like "TaskMaster Backend is running!"
4. Try adding `/api/auth/login` to the end - you should get a response (even if it's an error, it confirms the API is working)

---

## Method 2: If You Haven't Deployed Your Backend Yet

### Step 1: Deploy Backend to Vercel
1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**

### Step 2: Import Your Repository
1. Click **"Import Git Repository"**
2. Find your `Task-Master` repository
3. Click **"Import"**

### Step 3: Configure Backend Deployment
1. **IMPORTANT**: Set the **Root Directory** to `backend`
   - Look for "Root Directory" setting
   - Type: `backend`
   - This tells Vercel to deploy only the backend folder

### Step 4: Add Environment Variables
Before deploying, click **"Environment Variables"** and add:
```
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters-long
JWT_EXPIRES_IN=7d
```

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait for deployment to complete (usually 1-3 minutes)
3. You'll get a URL like `https://task-master-backend.vercel.app`

---

## Method 3: Check Your Vercel Project Settings

### If You're Not Sure Which Project is Your Backend:

1. **Go to each project** in your Vercel dashboard
2. **Click on the project name**
3. **Look for these indicators**:
   - Project has `backend` in the root directory setting
   - Project contains files like `index.ts`, `routes/`, `package.json` with Express
   - Environment variables include `JWT_SECRET`, `NODE_ENV`

---

## Quick Test: Verify Your Backend URL

Once you have your backend URL, test it:

### Test 1: Basic Health Check
1. Open browser
2. Go to: `https://your-backend-url.vercel.app`
3. Should see: "TaskMaster Backend is running!"

### Test 2: API Endpoint Check
1. Open browser
2. Go to: `https://your-backend-url.vercel.app/api/auth/login`
3. Should see an error message (this is normal - it means the API is working)

---

## Common Backend URLs You Might Have

Based on your repository name, your backend URL might be one of these:
- `https://task-master-backend.vercel.app`
- `https://task-master-api.vercel.app`
- `https://taskmaster-backend.vercel.app`
- `https://task-master-backend-[random-string].vercel.app`

---

## What to Do Next

Once you have your backend URL:

1. **Copy the exact URL** (including https://)
2. **Update your frontend environment variable**:
   - Go to your frontend Vercel project
   - Go to Settings → Environment Variables
   - Update `VITE_API_BASE_URL` with your backend URL
3. **Redeploy your frontend**

---

## Troubleshooting

### "I can't find my backend project"
- Check if you deployed the backend as a separate project
- Look for projects with "backend" or "api" in the name
- Check if the backend was deployed as part of the frontend (this would cause issues)

### "My backend URL gives a 404 error"
- The backend might not be deployed correctly
- Check if the Root Directory is set to `backend`
- Check the Vercel function logs for errors

### "I see a Vercel error page"
- Check the deployment logs in Vercel
- Verify environment variables are set correctly
- Make sure all dependencies are listed in `backend/package.json`

---

## Need Help?

If you're still having trouble:
1. Share a screenshot of your Vercel dashboard
2. Tell me what projects you see listed
3. I can help identify which one is your backend
