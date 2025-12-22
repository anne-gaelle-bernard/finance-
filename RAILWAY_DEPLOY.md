# Railway Deployment Guide for Finance Tracker

## 🚀 Quick Deploy to Railway

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login to Railway
```bash
railway login
```

### 3. Initialize Project
```bash
cd backend
railway init
```

### 4. Set Environment Variables

In Railway Dashboard or via CLI:

```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-super-secure-random-string-at-least-32-characters-long
railway variables set MONGODB_URI=mongodb+srv://username:6949bf57321d927240697557@cluster0.rqiea.mongodb.net/finance-tracker?retryWrites=true&w=majority&appName=Cluster0
railway variables set CLIENT_URL=https://your-frontend-domain.vercel.app
```

### 5. Deploy
```bash
railway up
```

### 6. Get Your Backend URL
```bash
railway domain
```

## 🌐 Deploy Frontend to Vercel

### 1. Update Frontend Environment
Edit `frontend/.env.production`:
```
VITE_API_URL=https://your-backend.railway.app/api
```

### 2. Deploy to Vercel
```bash
cd frontend
npm install -g vercel
vercel --prod
```

### 3. Update Backend CLIENT_URL
Set in Railway:
```bash
railway variables set CLIENT_URL=https://your-frontend.vercel.app
```

## ✅ Post-Deployment Checklist

- [ ] MongoDB Atlas Network Access: Add `0.0.0.0/0`
- [ ] Railway environment variables set
- [ ] Frontend .env.production updated
- [ ] CORS CLIENT_URL matches frontend domain
- [ ] Test `/api/health` endpoint
- [ ] Test user registration and login
- [ ] Verify HTTPS on both frontend and backend

## 🔧 Useful Railway Commands

```bash
# View logs
railway logs

# Check status
railway status

# Open dashboard
railway open

# Link to existing project
railway link

# Deploy specific service
railway up --service backend
```

## 🐛 Troubleshooting

**MongoDB Connection Failed**
- Check MONGODB_URI format
- Verify Network Access in MongoDB Atlas
- Ensure password has no special characters or URL encode them

**CORS Errors**
- Verify CLIENT_URL in Railway variables
- Check frontend is using correct API URL
- Ensure both use HTTPS in production

**Build Fails**
- Check Node version (should be >=18)
- Verify all dependencies in package.json
- Check Railway build logs

**Port Binding Issues**
- Railway auto-assigns PORT
- Ensure server uses `process.env.PORT || 5000`
- Don't hardcode port numbers

## 📊 Monitor Your App

- Railway Dashboard: https://railway.app/dashboard
- View logs in real-time
- Check resource usage
- Monitor deployments
