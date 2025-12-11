# Pre-Deployment Checklist

## ✅ Before You Start

### 1. MongoDB Setup
- [ ] MongoDB Atlas account created
- [ ] Cluster created and running
- [ ] Database user created with read/write permissions
- [ ] Network Access configured (add `0.0.0.0/0` for Vercel)
- [ ] Connection string copied and ready

**Connection String Format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database-name?retryWrites=true&w=majority
```

### 2. Generate Secrets
- [ ] Run `cd backend && node scripts/generate-secrets.js`
- [ ] Copy JWT_SECRET
- [ ] Copy NEXTAUTH_SECRET
- [ ] Copy SESSION_SECRET
- [ ] Store securely (don't commit to git)

### 3. GitHub Repository
- [ ] Repository created: https://github.com/ubaidtra/markiz-faisal-management-system
- [ ] Code pushed to main branch
- [ ] .gitignore configured (excludes .env files)
- [ ] README.md updated

### 4. Vercel Account
- [ ] Vercel account created at vercel.com
- [ ] GitHub account connected to Vercel
- [ ] Vercel CLI installed (`npm install -g vercel`)

---

## 🚀 Deployment Steps

### Step 1: Initial Vercel Deployment
```bash
vercel login
vercel
```
- [ ] Answered all prompts correctly
- [ ] Project created successfully
- [ ] Got deployment URL

### Step 2: Configure Environment Variables

Go to: **Vercel Dashboard → Project → Settings → Environment Variables**

Add these variables (for Production environment):

- [ ] `MONGODB_URI` = your MongoDB connection string
- [ ] `JWT_SECRET` = generated JWT secret
- [ ] `NEXTAUTH_SECRET` = generated NextAuth secret
- [ ] `SESSION_SECRET` = generated session secret
- [ ] `NODE_ENV` = production
- [ ] `PORT` = 7000
- [ ] `REACT_APP_API_URL` = https://your-app.vercel.app/api

**Important:** Add variables for Production, Preview, and Development environments.

### Step 3: Redeploy
```bash
vercel --prod
```
- [ ] Deployment successful
- [ ] No build errors
- [ ] Deployment URL accessible

### Step 4: Database Seeding

**Option A: Local Seed Script**
```bash
cd backend
echo "MONGODB_URI=your-production-mongodb-uri" > .env
npm run seed
rm .env
```

**Option B: MongoDB Compass**
- [ ] Connect to MongoDB Atlas
- [ ] Create users collection
- [ ] Insert admin, teacher, accountant users

- [ ] Admin user created
- [ ] Teacher user created
- [ ] Accountant user created

### Step 5: Testing

- [ ] Health endpoint works: `/api/health`
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] Login works with admin credentials
- [ ] Dashboard displays correctly
- [ ] Student registration works
- [ ] API endpoints respond correctly
- [ ] No console errors in browser

### Step 6: Security

- [ ] Default passwords changed
- [ ] MongoDB IP whitelist configured
- [ ] Environment variables not exposed
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] CORS configured correctly

---

## 📋 Post-Deployment

### Monitoring
- [ ] Vercel Analytics enabled
- [ ] Error logs monitored
- [ ] Performance metrics checked

### Documentation
- [ ] Deployment URL documented
- [ ] Login credentials stored securely
- [ ] Environment variables documented
- [ ] Team members have access

### Backup
- [ ] MongoDB backups configured
- [ ] Code repository backed up
- [ ] Environment variables backed up securely

---

## 🔧 Troubleshooting

### If Build Fails:
- [ ] Check build logs in Vercel dashboard
- [ ] Verify all dependencies in package.json
- [ ] Check Node.js version compatibility
- [ ] Verify vercel.json configuration

### If API Doesn't Work:
- [ ] Verify environment variables are set
- [ ] Check MongoDB connection string
- [ ] Verify MongoDB IP whitelist
- [ ] Check API routes in vercel.json

### If Frontend Can't Connect:
- [ ] Verify REACT_APP_API_URL is correct
- [ ] Check CORS configuration
- [ ] Verify backend is deployed
- [ ] Check browser console for errors

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
- **Project Repository:** https://github.com/ubaidtra/markiz-faisal-management-system
- **Deployment Guide:** See VERCEL_DEPLOYMENT_GUIDE.md

---

## ⚠️ Important Reminders

1. **Never commit .env files** - They're in .gitignore
2. **Change default passwords** - After first login
3. **Keep secrets secure** - Store them safely
4. **Monitor logs** - Check Vercel dashboard regularly
5. **Backup database** - Configure MongoDB Atlas backups

---

**Status:** Ready for Deployment ✅

