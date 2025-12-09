# Quick Start Guide

## Prerequisites Check

1. **Node.js**: Run `node --version` (should be v14+)
2. **MongoDB**: Ensure MongoDB is installed and running
3. **npm**: Run `npm --version`

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```
PORT=7000
MONGODB_URI=mongodb+srv://ubaidttech_db_user:tra%40tech.281986@cluster0.lxszwnk.mongodb.net/faisal-center?appName=Cluster0
JWT_SECRET=faisal-center-secret-key-2024
NODE_ENV=development
```

**Note**: The `@` symbol in the password is URL-encoded as `%40` in the connection string.

**Frontend** (`frontend/.env`):
```
REACT_APP_API_URL=http://localhost:7000/api
```

### 3. Start MongoDB

**Windows:**
```bash
mongod
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
# or
mongod
```

### 4. Seed Initial Users

```bash
cd backend
npm run seed
```

This creates:
- Admin: `admin` / `admin123`
- Teacher: `teacher` / `teacher123`
- Accountant: `accountant` / `accountant123`

### 5. Start the Application

**Option 1: Run both servers together (Recommended)**
```bash
# From root directory
npm run dev
```

**Option 2: Run servers separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:7000/api

## First Login

1. Navigate to http://localhost:3000
2. Click "Sign In" or go to http://localhost:3000/login
3. Use one of the default credentials:
   - Admin: `admin` / `admin123`
   - Teacher: `teacher` / `teacher123`
   - Accountant: `accountant` / `accountant123`

## Troubleshooting

### MongoDB Connection Error
- Check MongoDB URI in `backend/.env` (using MongoDB Atlas cloud database)
- Verify internet connection for MongoDB Atlas access
- Check MongoDB Atlas cluster status and IP whitelist settings

### Port Already in Use
- Backend (7000): Change `PORT` in `backend/.env`
- Frontend (3000): Set `PORT=3001` in `frontend/.env` or use `npm start -- --port 3001`

### Module Not Found Errors
- Run `npm install` in the respective directory (backend or frontend)
- Delete `node_modules` and `package-lock.json`, then reinstall

### CORS Errors
- Ensure backend is running on port 7000
- Check `REACT_APP_API_URL` in `frontend/.env`

## Next Steps

1. **Change Default Passwords**: Update passwords for default users after first login
2. **Add Your Data**: Start adding students, teachers, and other data
3. **Customize**: Update branding, colors, and content as needed

## Support

For issues or questions, refer to the main README.md file.

