# Deployment Guide

This guide covers deploying the Faisal Center Management System to various platforms.

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or MongoDB instance)
- Git repository access
- Environment variables configured

## Environment Variables

### Backend (.env in backend folder)

```env
MONGODB_URI=your-mongodb-connection-string
PORT=7000
JWT_SECRET=your-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
SESSION_SECRET=your-session-secret
NODE_ENV=production
```

Generate secrets using:
```bash
cd backend
node scripts/generate-secrets.js
```

### Frontend (.env in frontend folder)

```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## Deployment Options

### Option 1: Vercel (Recommended for Frontend + Backend)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set Environment Variables:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all backend environment variables
   - Add `REACT_APP_API_URL` for frontend

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Heroku

1. **Install Heroku CLI:**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create App:**
   ```bash
   heroku create faisal-center-backend
   ```

4. **Set Environment Variables:**
   ```bash
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set NEXTAUTH_SECRET=your-nextauth-secret
   heroku config:set SESSION_SECRET=your-session-secret
   heroku config:set NODE_ENV=production
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

6. **For Frontend (separate app or Netlify):**
   - Build frontend: `cd frontend && npm run build`
   - Deploy `build` folder to Netlify/Vercel
   - Set `REACT_APP_API_URL` to your Heroku backend URL

### Option 3: Railway

1. **Connect Repository:**
   - Go to Railway.app
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository

2. **Configure:**
   - Set root directory to `backend`
   - Add environment variables
   - Set start command: `npm start`

3. **Deploy Frontend Separately:**
   - Create new service for frontend
   - Set root directory to `frontend`
   - Build command: `npm run build`
   - Start command: `npx serve -s build`

### Option 4: DigitalOcean / AWS / Azure

#### Backend Setup:

1. **SSH into server:**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone Repository:**
   ```bash
   git clone https://github.com/ubaidtra/fisal-center-management-system.git
   cd fisal-center-management-system
   ```

4. **Install Dependencies:**
   ```bash
   cd backend
   npm install --production
   ```

5. **Create .env file:**
   ```bash
   nano .env
   # Add all environment variables
   ```

6. **Use PM2 for Process Management:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name faisal-backend
   pm2 save
   pm2 startup
   ```

7. **Setup Nginx Reverse Proxy:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location /api {
           proxy_pass http://localhost:7000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

#### Frontend Setup:

1. **Build Frontend:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Serve with Nginx:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/frontend/build;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## Build Commands

### Development:
```bash
npm run dev
```

### Production Build:
```bash
# Backend (no build needed, just install)
cd backend
npm install --production

# Frontend
cd frontend
npm install
npm run build
```

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] MongoDB connection working
- [ ] Backend API accessible
- [ ] Frontend build successful
- [ ] CORS configured correctly
- [ ] SSL/HTTPS enabled
- [ ] Admin user seeded (run `npm run seed` in backend)
- [ ] Test login functionality
- [ ] Test student registration
- [ ] Monitor logs for errors

## Troubleshooting

### Backend Issues:

1. **Port already in use:**
   ```bash
   # Find process
   lsof -i :7000
   # Kill process
   kill -9 <PID>
   ```

2. **MongoDB connection failed:**
   - Check MongoDB Atlas IP whitelist
   - Verify connection string
   - Check network connectivity

3. **JWT errors:**
   - Verify JWT_SECRET is set
   - Check token expiration settings

### Frontend Issues:

1. **API calls failing:**
   - Verify REACT_APP_API_URL is correct
   - Check CORS settings on backend
   - Verify backend is accessible

2. **Build errors:**
   ```bash
   # Clear cache and rebuild
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

## Security Checklist

- [ ] Use strong, unique secrets
- [ ] Enable HTTPS/SSL
- [ ] Set secure CORS origins
- [ ] Use environment variables (never commit secrets)
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Backup database regularly

## Support

For issues or questions, please check:
- GitHub Issues: https://github.com/ubaidtra/fisal-center-management-system/issues
- Documentation: README.md

