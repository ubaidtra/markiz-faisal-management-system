# Vercel Deployment Guide

## ✅ GitHub Push Complete!

Your code has been successfully pushed to:
**https://github.com/ubaidtra/fisal-center-management-system.git**

## 🚀 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import GitHub Repository:**
   - Select: `ubaidtra/fisal-center-management-system`
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Other
   - **Root Directory:** `./` (root)
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Output Directory:** `frontend/build`
   - **Install Command:** `npm run install-all`

4. **Set Environment Variables:**
   Click "Environment Variables" and add:

   ```
   MONGODB_URI=mongodb+srv://ubaidttech_db_user:tra%40tech.281986@cluster0.lxszwnk.mongodb.net/faisal-center?appName=Cluster0
   PORT=7000
   JWT_SECRET=b9aefc221da1c0150c63f81027d9df96bc80e6f8cf31e8beaa9288684af54353eb3517371b11b7f5574637c17e504f221d5f472522dfeb16c705e1d39a89d58d
   NEXTAUTH_SECRET=IqLIJCUdWbvBvDZF0b6e1XnV/ZSppheYLpwAgzT1lIo=
   SESSION_SECRET=0c33bcf6cbf96c870952dfc53da6b0e9ebb65c7959613c3b3c638bda712f0aa2
   NODE_ENV=production
   REACT_APP_API_URL=https://your-project-name.vercel.app/api
   ```

   **Important:** Replace `your-project-name` with your actual Vercel project name in `REACT_APP_API_URL`

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete

### Option 2: Deploy via CLI

```bash
# 1. Navigate to project root
cd "C:\Markiz Faisal"

# 2. Deploy (first time - will ask questions)
vercel

# 3. Set environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add NEXTAUTH_SECRET
vercel env add SESSION_SECRET
vercel env add NODE_ENV
vercel env add REACT_APP_API_URL

# 4. Deploy to production
vercel --prod
```

### Environment Variables Setup (CLI)

When prompted, enter these values:

```bash
# MongoDB URI
mongodb+srv://ubaidttech_db_user:tra%40tech.281986@cluster0.lxszwnk.mongodb.net/faisal-center?appName=Cluster0

# JWT Secret
b9aefc221da1c0150c63f81027d9df96bc80e6f8cf31e8beaa9288684af54353eb3517371b11b7f5574637c17e504f221d5f472522dfeb16c705e1d39a89d58d

# NextAuth Secret
IqLIJCUdWbvBvDZF0b6e1XnV/ZSppheYLpwAgzT1lIo=

# Session Secret
0c33bcf6cbf96c870952dfc53da6b0e9ebb65c7959613c3b3c638bda712f0aa2

# Node Environment
production

# React App API URL (update after first deployment)
https://your-project-name.vercel.app/api
```

## 📝 Post-Deployment Steps

1. **Update REACT_APP_API_URL:**
   - After first deployment, get your Vercel URL
   - Update `REACT_APP_API_URL` environment variable to: `https://your-project.vercel.app/api`
   - Redeploy

2. **Seed Admin User:**
   ```bash
   # Connect to your MongoDB and run:
   cd backend
   npm run seed
   ```

3. **Test Deployment:**
   - Visit your Vercel URL
   - Login with: `admin` / `admin123`

## 🔧 Vercel Configuration

The project includes `vercel.json` with:
- Backend API routes (`/api/*`)
- Frontend static files
- Proper routing configuration

## ⚠️ Important Notes

1. **MongoDB Atlas:**
   - Ensure your MongoDB Atlas IP whitelist includes Vercel IPs (0.0.0.0/0 for testing)
   - Or add specific Vercel serverless function IPs

2. **API Routes:**
   - Backend API will be available at: `https://your-project.vercel.app/api/*`
   - Frontend will be served from root

3. **Environment Variables:**
   - Set all variables in Vercel dashboard
   - Update `REACT_APP_API_URL` after first deployment with actual URL

4. **Build Time:**
   - First deployment may take 3-5 minutes
   - Subsequent deployments are faster

## 🐛 Troubleshooting

### Build Fails:
- Check environment variables are set
- Verify MongoDB connection string
- Check build logs in Vercel dashboard

### API Not Working:
- Verify `REACT_APP_API_URL` is correct
- Check CORS settings
- Verify MongoDB connection

### Frontend Can't Connect to Backend:
- Update `REACT_APP_API_URL` with correct Vercel URL
- Redeploy after updating environment variables

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Project Repo: https://github.com/ubaidtra/fisal-center-management-system

