# Environment Variables Configuration

## MongoDB Connection String

Your MongoDB connection string has been configured:

```
mongodb+srv://Abdoullahsecka:secka281986@cluster0.lxszwnk.mongodb.net/faisal-center?retryWrites=true&w=majority&appName=markiz-faisal-management-system
```

**Database Name:** `faisal-center`

---

## Required Environment Variables for Vercel

### Backend Variables

Add these in **Vercel Dashboard → Settings → Environment Variables**:

```env
MONGODB_URI=mongodb+srv://Abdoullahsecka:secka281986@cluster0.lxszwnk.mongodb.net/faisal-center?retryWrites=true&w=majority&appName=markiz-faisal-management-system
JWT_SECRET=your-generated-jwt-secret-here
NEXTAUTH_SECRET=your-generated-nextauth-secret-here
SESSION_SECRET=your-generated-session-secret-here
NODE_ENV=production
PORT=7000
```

### Frontend Variables

```env
REACT_APP_API_URL=https://your-app.vercel.app/api
```

**Important:** Replace `your-app.vercel.app` with your actual Vercel deployment URL after deployment.

---

## Generate Secrets

Run this command to generate secure secrets:

```bash
cd backend
node scripts/generate-secrets.js
```

Copy the output and add to Vercel environment variables.

---

## MongoDB Atlas Configuration

### Network Access

1. Go to MongoDB Atlas Dashboard
2. Click "Network Access"
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere" (0.0.0.0/0)
5. Click "Confirm"

This allows Vercel to connect to your MongoDB database.

### Database User

Your database user:
- **Username:** `Abdoullahsecka`
- **Password:** `secka281986`

Make sure this user has read/write permissions in MongoDB Atlas.

---

## Local Development (.env files)

### backend/.env

```env
MONGODB_URI=mongodb+srv://Abdoullahsecka:secka281986@cluster0.lxszwnk.mongodb.net/faisal-center?retryWrites=true&w=majority&appName=markiz-faisal-management-system
PORT=7000
JWT_SECRET=your-local-jwt-secret
NEXTAUTH_SECRET=your-local-nextauth-secret
SESSION_SECRET=your-local-session-secret
NODE_ENV=development
```

### frontend/.env

```env
REACT_APP_API_URL=http://localhost:7000/api
```

---

## Security Notes

⚠️ **Important:**
- Never commit `.env` files to git (they're in .gitignore)
- Use different secrets for production and development
- Keep your MongoDB password secure
- Change default admin password after first login

---

## Verification

After setting environment variables in Vercel:

1. Deploy: `vercel --prod`
2. Check health: `https://your-app.vercel.app/api/health`
3. Should return: `{"status":"ok",...}`

If connection fails, check:
- MongoDB Atlas network access (IP whitelist)
- Connection string format
- Database user permissions

