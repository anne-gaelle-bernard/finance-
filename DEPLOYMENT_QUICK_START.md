# 🚀 Quick Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] All code committed to GitHub
- [ ] `.env` files are in `.gitignore` (not pushed)
- [ ] Both `backend` and `frontend` have `package.json` with scripts
- [ ] MongoDB database is prepared (Atlas or Railway)
- [ ] Railway account created
- [ ] Vercel account created

---

## 📋 Deployment Steps

### Step 1: Backend on Railway (5 min)

```
1. Go to railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables:
   - PORT=5000
   - NODE_ENV=production
   - JWT_SECRET=<your-32-char-secret>
   - MONGODB_URI=<your-mongodb-url>
   - CLIENT_URL=https://your-vercel-url.vercel.app
5. Railway deploys automatically
6. Copy the backend URL (e.g., https://project.up.railway.app)
```

### Step 2: Update Frontend Code

```
File: frontend/.env.production
Content:
VITE_API_URL=https://your-project.up.railway.app/api
```

### Step 3: Push to GitHub

```bash
git add .
git commit -m "Setup production deployment"
git push origin main
```

### Step 4: Frontend on Vercel (3 min)

```
1. Go to vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. Root directory: frontend
5. Deploy (Vercel auto-detects React + Vite)
6. Copy the Vercel URL (e.g., https://yourapp.vercel.app)
```

### Step 5: Final Update in Railway

```
1. Go to Railway dashboard → Your backend service
2. Click "Variables"
3. Update CLIENT_URL = https://yourapp.vercel.app
4. Save (backend restarts automatically)
```

---

## ✅ Testing

| Test | Command/URL | Expected |
|------|------------|----------|
| Backend Health | `https://your-project.up.railway.app/api/health` | `{"status":"OK","database":"connected"}` |
| Frontend Load | `https://yourapp.vercel.app` | Login page displays |
| Register | Email: test@test.com, Password: test123 | Account created, redirects to dashboard |
| Login | Use credentials above | Dashboard displays with data |
| Database | Create a transaction | Data persists after refresh |

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Railway Dashboard | https://railway.app/dashboard |
| Vercel Dashboard | https://vercel.com/dashboard |
| Your Backend API | `https://your-project.up.railway.app` |
| Your Frontend | `https://yourapp.vercel.app` |

---

## 🔐 Environment Variables Summary

**Backend (Railway Variables)**
```
PORT=5000
NODE_ENV=production
JWT_SECRET=financetracker_CHANGE_THIS_xyz...
MONGODB_URI=mongodb+srv://user:pass@cluster.db.mongodb.net/Finance?...
CLIENT_URL=https://yourapp.vercel.app
```

**Frontend (Vercel Environment Variables - Optional)**
```
VITE_API_URL=https://your-project.up.railway.app/api
```

Or use the `.env.production` file in the code.

---

## 🆘 Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| API not responding | Check Railway backend is running (Deployments tab) |
| CORS error | Update `CLIENT_URL` in Railway to match Vercel URL |
| Login failing | Verify `MONGODB_URI` and database connection |
| Cannot see frontend | Check Vercel deployment succeeded |
| Database empty | First time? Create test account to seed DB |

---

## 📞 Support Resources

- **Railway Logs**: Dashboard → Service → Logs tab
- **Vercel Logs**: Dashboard → Deployments → Click a deployment → Logs
- **MongoDB Status**: MongoDB Atlas dashboard
- **Documentation**: See [DEPLOYMENT_COMPLETE.md](./DEPLOYMENT_COMPLETE.md)

---

**Time to deploy**: ~10 minutes
**Cost**: Free tier (Railway + Vercel + MongoDB Atlas)
**Auto-redeploy on git push**: ✅ Enabled

Good luck! 🎉
