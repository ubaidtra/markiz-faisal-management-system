# Complete Vercel Deployment Guide

## Step-by-Step Deployment Instructions

### Prerequisites

1. **GitHub Account** - Your code must be on GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Atlas Account** - For database hosting
4. **Node.js** - Installed locally for testing

---

## Part 1: Prepare Your Project

### 1.1 Update Git Remote (if needed)

```bash
# Check current remote
git remote -v

# Update to new repository
git remote set-url origin https://github.com/ubaidtra/markiz-faisal-management-system.git

# Verify
git remote -v
```

### 1.2 Push Code to GitHub

```bash
# Add all files
git add .

# Commit changes
git commit -m "Prepare for Vercel deployment"

# Push to GitHub
git push origin main
```

---

## Part 2: MongoDB Setup

### 2.1 Get Your MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in to your account
3. Create a new cluster (or use existing)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with your database name (e.g., `faisal-center`)

**Example Connection String:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/faisal-center?retryWrites=true&w=majority
```

### 2.2 Configure MongoDB Atlas

1. **Network Access:**
   - Go to "Network Access" in MongoDB Atlas
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for Vercel
   - Or add Vercel's IP ranges

2. **Database User:**
   - Go to "Database Access"
   - Create a database user with read/write permissions
   - Save the username and password

---

## Part 3: Generate Secrets

### 3.1 Generate JWT and Session Secrets

```bash
cd backend
node scripts/generate-secrets.js
```

This will output:
- `JWT_SECRET`
- `NEXTAUTH_SECRET`
- `SESSION_SECRET`

**Save these values** - you'll need them for Vercel environment variables.

---

## Part 4: Deploy to Vercel

### 4.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 4.2 Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### 4.3 Initial Deployment

```bash
# From project root directory
vercel
```

**Answer the prompts:**
- Set up and deploy? **Yes**
- Which scope? **Select your account**
- Link to existing project? **No**
- Project name? **markiz-faisal-management-system** (or your preferred name)
- Directory? **./** (current directory)
- Override settings? **No**

### 4.4 Configure Environment Variables

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

**For Production:**
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/faisal-center?retryWrites=true&w=majority
JWT_SECRET=your-generated-jwt-secret-here
NEXTAUTH_SECRET=your-generated-nextauth-secret-here
SESSION_SECRET=your-generated-session-secret-here
NODE_ENV=production
PORT=7000
```

**For Preview/Development:**
- Add the same variables (Vercel will use them for preview deployments)

**Option B: Via CLI**

```bash
vercel env add MONGODB_URI production
# Paste your MongoDB connection string when prompted

vercel env add JWT_SECRET production
# Paste your JWT secret

vercel env add NEXTAUTH_SECRET production
# Paste your NEXTAUTH secret

vercel env add SESSION_SECRET production
# Paste your SESSION secret

vercel env add NODE_ENV production
# Enter: production

vercel env add PORT production
# Enter: 7000
```

### 4.5 Update Frontend API URL

After deployment, Vercel will give you a URL like:
`https://markiz-faisal-management-system.vercel.app`

**Add this environment variable:**
```
REACT_APP_API_URL=https://markiz-faisal-management-system.vercel.app/api
```

**Important:** The frontend needs to know where the backend API is. Since we're deploying full-stack on Vercel, the API will be at `/api/*`.

### 4.6 Redeploy with Environment Variables

```bash
vercel --prod
```

Or trigger a redeploy from the Vercel dashboard:
- Go to **Deployments**
- Click the **"..."** menu on latest deployment
- Click **"Redeploy"**

---

## Part 5: Verify Deployment

### 5.1 Check Health Endpoint

Visit: `https://your-app.vercel.app/api/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX...",
  "environment": "production"
}
```

### 5.2 Test API Endpoints

```bash
# Test login endpoint
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 5.3 Seed Database

**Option A: Run seed script locally (pointing to production DB)**

Create `backend/.env` temporarily:
```env
MONGODB_URI=your-production-mongodb-uri
```

Then run:
```bash
cd backend
npm run seed
```

**Option B: Use MongoDB Compass or Atlas UI**

Manually create users in MongoDB Atlas.

### 5.4 Test Frontend

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try logging in with:
   - Username: `admin`
   - Password: `admin123`

---

## Part 6: Configure Custom Domain (Optional)

### 6.1 Add Domain in Vercel

1. Go to **Settings** → **Domains**
2. Enter your domain (e.g., `faisalcenter.com`)
3. Follow DNS configuration instructions

### 6.2 Update DNS Records

Add CNAME record:
```
Type: CNAME
Name: @ (or www)
Value: cname.vercel-dns.com
```

### 6.3 Update Environment Variables

Update `REACT_APP_API_URL` to use your custom domain:
```
REACT_APP_API_URL=https://yourdomain.com/api
```

---

## Part 7: Troubleshooting

### Issue: Build Fails

**Check:**
1. Node.js version in `package.json` (should be 18+)
2. Build logs in Vercel dashboard
3. Missing dependencies

**Fix:**
```bash
# Check backend/package.json has all dependencies
# Check frontend/package.json has all dependencies
```

### Issue: API Returns 404

**Check:**
1. `vercel.json` configuration
2. Routes are correctly defined
3. Environment variables are set

**Fix:**
- Verify `vercel.json` routes configuration
- Check API routes start with `/api/`

### Issue: MongoDB Connection Fails

**Check:**
1. MongoDB Atlas network access (IP whitelist)
2. Connection string format
3. Database user permissions

**Fix:**
- Add `0.0.0.0/0` to MongoDB Atlas IP whitelist
- Verify connection string includes database name
- Check username/password are correct

### Issue: Frontend Can't Connect to Backend

**Check:**
1. `REACT_APP_API_URL` environment variable
2. CORS configuration in backend
3. API routes are accessible

**Fix:**
- Set `REACT_APP_API_URL` to your Vercel URL + `/api`
- Verify CORS allows your frontend domain
- Test API endpoints directly

### Issue: Environment Variables Not Working

**Check:**
1. Variables are set for correct environment (Production/Preview)
2. Variable names are correct (case-sensitive)
3. Redeployed after adding variables

**Fix:**
- Add variables for all environments (Production, Preview, Development)
- Redeploy after adding variables
- Check variable names match exactly

---

## Part 8: Post-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] All environment variables configured
- [ ] MongoDB connection working
- [ ] Health endpoint returns OK
- [ ] Database seeded with admin user
- [ ] Frontend loads correctly
- [ ] Login functionality works
- [ ] API endpoints accessible
- [ ] CORS configured correctly
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic with Vercel)

---

## Part 9: Monitoring and Maintenance

### 9.1 View Logs

```bash
vercel logs
```

Or in Vercel Dashboard:
- Go to **Deployments**
- Click on a deployment
- View **Logs** tab

### 9.2 Monitor Performance

- Vercel Dashboard → **Analytics**
- Check API response times
- Monitor error rates

### 9.3 Update Deployment

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Vercel will auto-deploy, or manually:
vercel --prod
```

---

## Part 10: Production Best Practices

### 10.1 Security

- ✅ Use strong, unique secrets
- ✅ Never commit `.env` files
- ✅ Use HTTPS (automatic with Vercel)
- ✅ Enable MongoDB Atlas IP whitelist
- ✅ Use environment-specific variables

### 10.2 Performance

- ✅ Enable Vercel Edge Caching
- ✅ Optimize images
- ✅ Use CDN for static assets
- ✅ Monitor API response times

### 10.3 Backup

- ✅ Regular MongoDB Atlas backups
- ✅ Version control all code
- ✅ Document environment variables
- ✅ Keep deployment logs

---

## Quick Reference

### Vercel Commands

```bash
# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List projects
vercel projects list

# View environment variables
vercel env ls
```

### Important URLs

- **Vercel Dashboard:** https://vercel.com/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Project Repository:** https://github.com/ubaidtra/markiz-faisal-management-system

### Default Login Credentials

After seeding database:
- **Admin:** username: `admin`, password: `admin123`
- **Teacher:** username: `teacher`, password: `teacher123`
- **Accountant:** username: `accountant`, password: `accountant123`

**⚠️ IMPORTANT:** Change default passwords after first login!

---

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check MongoDB Atlas connection
3. Verify environment variables
4. Review API_DOCUMENTATION.md
5. Check GitHub Issues

---

**Deployment Status:** Ready for Production ✅

