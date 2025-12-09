# Quick Deployment Guide

## 🚀 Fastest Deployment Options

### Option 1: Vercel (Easiest - Full Stack)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Set environment variables in Vercel dashboard
# Go to: Project → Settings → Environment Variables
# Add: MONGODB_URI, JWT_SECRET, NEXTAUTH_SECRET, SESSION_SECRET
```

### Option 2: Heroku (Backend) + Netlify (Frontend)

**Backend (Heroku):**
```bash
heroku create faisal-center-backend
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

**Frontend (Netlify):**
1. Connect GitHub repo to Netlify
2. Build command: `cd frontend && npm install && npm run build`
3. Publish directory: `frontend/build`
4. Add environment variable: `REACT_APP_API_URL=https://your-heroku-app.herokuapp.com/api`

### Option 3: Docker (Self-Hosted)

```bash
# 1. Create .env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 2. Update environment variables
# Edit backend/.env and frontend/.env

# 3. Build and run
docker-compose up -d

# 4. Access at http://localhost:3000
```

## 📋 Pre-Deployment Checklist

- [ ] Generate secrets: `cd backend && node scripts/generate-secrets.js`
- [ ] Update `backend/.env` with MongoDB URI and secrets
- [ ] Update `frontend/.env` with production API URL
- [ ] Build frontend: `npm run build`
- [ ] Test locally: `npm run start:prod`
- [ ] Seed admin user: `cd backend && npm run seed`

## 🔐 Required Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
PORT=7000
JWT_SECRET=...
NEXTAUTH_SECRET=...
SESSION_SECRET=...
NODE_ENV=production
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

## 🛠️ Build Commands

```bash
# Install all dependencies
npm run install-all

# Build frontend
npm run build

# Build backend (production deps only)
npm run build:backend

# Build everything
npm run build:all

# Start production server
npm run start:prod
```

## 📞 Support

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

