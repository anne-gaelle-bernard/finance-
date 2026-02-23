# 🚀 Complete Deployment Guide - Vercel & Railway

## Overview
- **Frontend**: Vercel
- **Backend**: Railway  
- **Database**: MongoDB (Railway or Atlas)

---

## 📋 Prerequisites

1. **Railway Account**: https://railway.app
2. **Vercel Account**: https://vercel.com
3. **MongoDB Database URL** (Atlas or Railway MongoDB service)
4. **Git Repository** with code pushed to GitHub

---

## 🔧 Step 1: Deploy Backend to Railway

### 1.1 Connect GitHub to Railway

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub Repo"**
3. Select your GitHub repository containing the finance tracker
4. Railway will auto-detect the Node.js backend

### 1.2 Configure Environment Variables in Railway

Once your project is created, go to **Services** → **Your Backend Service** → **Variables**

Add these environment variables:

```
PORT=5000
NODE_ENV=production
JWT_SECRET=financetracker_super_secret_key_CHANGE_THIS_12345_at_least_32_chars_long
MONGODB_URI=mongodb+srv://username:password@cluster0.ottcut8.mongodb.net/Finance?retryWrites=true&w=majority&appName=Cluster0
CLIENT_URL=https://your-frontend-domain.vercel.app
```

**Important**: 
- Replace `MONGODB_URI` with your actual MongoDB connection string
- Replace `CLIENT_URL` with your Vercel frontend URL (you'll get this in Step 2)
- Keep `JWT_SECRET` secure and complex

### 1.3 Get Your Railway Backend URL

1. In Railway dashboard, select your backend service
2. Click **"Domain"** tab
3. You'll see: `https://your-project.up.railway.app`
4. **Save this URL** - you'll need it for the frontend

### 1.4 Deploy

Railway automatically deploys from git pushes. Check the **Deployments** tab for status.

---

## 🎨 Step 2: Deploy Frontend to Vercel

### 2.1 Update Frontend Environment File

Update `frontend/.env.production`:

```dotenv
VITE_API_URL=https://your-project.up.railway.app/api
```

Replace `your-project.up.railway.app` with your actual Railway backend URL from Step 1.3

### 2.2 Push Changes to GitHub

```bash
git add frontend/.env.production
git commit -m "Update production API URL"
git push origin main
```

### 2.3 Deploy to Vercel

**Option A: Automatic (Recommended)**
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. **Framework**: React (Auto-detected)
5. **Root Directory**: `frontend`
6. Click **"Deploy"**

**Option B: Manual Deploy**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

### 2.4 Get Your Vercel Frontend URL

After deployment completes, Vercel will show your live URL:
- Example: `https://finance-tracker-abc123.vercel.app`

---

## 🔄 Step 3: Update Backend with Frontend URL

**CRITICAL**: Now that you have your Vercel URL, update Railway:

1. Go to Railway dashboard → Your Backend Service → **Variables**
2. Find `CLIENT_URL` variable
3. Change it to: `https://finance-tracker-abc123.vercel.app` (use your actual Vercel URL)
4. **Save** - backend will automatically restart

---

## ✅ Testing

### 1. Test Backend Health Check
```
GET https://your-project.up.railway.app/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Finance Tracker API is running",
  "database": "connected",
  "timestamp": "2024-02-18T..."
}
```

### 2. Test Frontend Access
1. Open: `https://finance-tracker-abc123.vercel.app`
2. Try to **Register** a new account
3. Try to **Login**
4. Check **Dashboard** loads correctly

### 3. Test Database Connection
- Create a transaction in the dashboard
- Verify it saves to MongoDB
- Refresh page and verify data persists

---

## 🐛 Troubleshooting

### Frontend shows "API Error" or cannot connect
- ❌ Verify `VITE_API_URL` in Vercel environment variables
- ❌ Verify backend URL is accessible: `curl https://your-project.up.railway.app/api/health`
- ❌ Check CORS is properly configured in backend

### Login/Registration not working
- ❌ Check `JWT_SECRET` is set in Railway
- ❌ Check `MONGODB_URI` is correct and accessible
- ❌ Check database credentials are valid
- ❌ Review Railway logs for errors

### Database connection fails
- ❌ Verify MongoDB connection string is correct
- ❌ Check MongoDB Atlas IP whitelist includes Railway IPs (usually: 0.0.0.0/0 for all)
- ❌ Verify database user credentials

### How to View Logs

**Railway Logs**:
- Dashboard → Service → **Logs** tab

**Vercel Logs**:
- Dashboard → Project → **Deployments** → Click deployment → **Logs**

---

## 🔐 Security Checklist

- [ ] `JWT_SECRET` is complex (32+ chars, random)
- [ ] `MONGODB_URI` password is strong
- [ ] MongoDB IP whitelist is configured
- [ ] `NODE_ENV` is set to `production`
- [ ] `CLIENT_URL` is set to your production domain (not localhost)
- [ ] `.env` files are in `.gitignore` (not committed)

---

## 📦 Environment Variables Summary

### Railway Backend Variables
| Variable | Value | Example |
|----------|-------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `production` |
| `JWT_SECRET` | JWT signing key | Random 32+ char string |
| `MONGODB_URI` | Database URL | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `CLIENT_URL` | Frontend domain | `https://yourapp.vercel.app` |

### Vercel Frontend Variables
| Variable | Value |
|----------|-------|
| `VITE_API_URL` | Backend API URL |

---

## 🚀 Quick Redeploy

If you make changes and want to redeploy:

1. **Backend**: Push to GitHub → Railway auto-deploys
2. **Frontend**: 
   - Push to GitHub → Vercel auto-deploys
   - OR: Run `vercel --prod` in frontend directory

---

## 📞 Need Help?

- **Railway Support**: https://railway.app/support
- **Vercel Support**: https://vercel.com/support
- **MongoDB Support**: https://www.mongodb.com/support
- Check logs in both Railway and Vercel dashboards

---

**Last Updated**: February 18, 2026
