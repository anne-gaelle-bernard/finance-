# 🚂 Railway Deployment - Ready!

Your Finance Tracker is now configured for Railway deployment.

## Files Created/Updated:

✅ **Backend**
- `railway.json` - Railway configuration
- `Procfile` - Process file for deployment
- `.env.example` - Template for environment variables
- `.gitignore` - Ignore sensitive files
- `package.json` - Added Node.js version (>=18)
- `server.js` - Updated CORS for production

✅ **Frontend**
- `.env` - Development API URL
- `.env.production` - Production API URL template
- `.env.example` - Environment variables template
- `.gitignore` - Ignore build files

✅ **Documentation**
- `DEPLOYMENT.md` - General deployment guide
- `RAILWAY_DEPLOY.md` - Railway-specific quick start

## 🚀 Deploy Now in 3 Steps:

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### 2. Deploy Backend
```bash
cd backend
railway init
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=super-secret-key-min-32-chars
railway variables set MONGODB_URI=mongodb+srv://username:6949bf57321d927240697557@cluster0.rqiea.mongodb.net/finance-tracker
railway variables set CLIENT_URL=https://your-frontend.vercel.app
railway up
```

### 3. Deploy Frontend
```bash
cd frontend
# Update .env.production with Railway backend URL
vercel --prod
```

## 🔑 Important Environment Variables:

**Backend (Railway):**
- `NODE_ENV=production`
- `JWT_SECRET` - Strong random string (32+ chars)
- `MONGODB_URI` - Your MongoDB Atlas connection
- `CLIENT_URL` - Frontend URL (for CORS)
- `PORT` - Auto-set by Railway

**Frontend (Vercel):**
- `VITE_API_URL` - Your Railway backend URL + /api

## 📖 Full Instructions:

See `RAILWAY_DEPLOY.md` for detailed step-by-step guide.

Good luck with deployment! 🎉
