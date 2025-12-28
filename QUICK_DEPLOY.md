# ⚡ Quick Deployment Steps

## 🔴 IMPORTANT: Fix MongoDB First

### MongoDB Atlas Setup
1. Go to https://cloud.mongodb.com
2. Login to your account
3. Select your cluster (Cluster0)
4. Click "Database Access" (left sidebar)
5. Click "Add New Database User"
6. Create user:
   - **Username**: `Annnefinance`
   - **Password**: `ZWmlOP9Kc-MkkUf60`
   - **Role**: Atlas Admin or Read/Write to any database
7. Click "Add User"

8. Click "Network Access" (left sidebar)
9. Click "Add IP Address"
10. Select "Allow Access from Anywhere" (0.0.0.0/0)
11. Click "Confirm"

Wait 1-2 minutes for changes to propagate.

---

## 🚀 Deploy to Railway (Backend)

### Option A: Using Railway Dashboard (Recommended)

1. **Go to Railway**: https://railway.app
2. **Login** with your GitHub account
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**: `anne-gaelle-bernard/finance-`
6. **Configure**:
   - Root Directory: `/backend`
   - Click "Add variables"

7. **Add Environment Variables**:
   ```
   NODE_ENV=production
   JWT_SECRET=5cd7e37a-8791-4d66-8d5c-514831dc4dc6
   MONGODB_URI=mongodb+srv://Annnefinance:ZWmlOP9Kc-MkkUf60@cluster0.ottcut8.mongodb.net/Finance?retryWrites=true&w=majority&appName=Cluster0
   CLIENT_URL=https://your-app-will-update-this-later.vercel.app
   PORT=5000
   ```

8. **Click Deploy**

9. **After deployment**, click "Settings" → "Networking"
   - Click "Generate Domain"
   - **Copy your backend URL**: `https://xxxxx.up.railway.app`

### Option B: Using Railway CLI

```bash
# Login
railway login

# Initialize (in backend folder)
cd backend
railway init

# Add environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=5cd7e37a-8791-4d66-8d5c-514831dc4dc6
railway variables set MONGODB_URI=mongodb+srv://Annnefinance:ZWmlOP9Kc-MkkUf60@cluster0.ottcut8.mongodb.net/Finance?retryWrites=true&w=majority&appName=Cluster0
railway variables set CLIENT_URL=https://temp.vercel.app
railway variables set PORT=5000

# Deploy
railway up

# Get domain
railway domain
```

---

## 🌐 Deploy to Vercel (Frontend)

### Step 1: Update Production Environment

Replace the API URL in `frontend/.env.production`:
```env
VITE_API_URL=https://YOUR-RAILWAY-URL.up.railway.app/api
```

**Example**:
```env
VITE_API_URL=https://finance-production-b622.up.railway.app/api
```

### Step 2: Deploy

```bash
cd frontend
vercel --prod
```

Follow prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No** (first time) or **Yes** (subsequent)
- Project name: `finance-tracker`
- Directory: `./`
- Override settings? **No**

### Step 3: Get Your Vercel URL

After deployment, you'll see:
```
✅ Production: https://finance-tracker-xyz.vercel.app
```

**Copy this URL!**

### Step 4: Update Railway CORS

Go back to Railway:
1. Open your backend project
2. Click "Variables"
3. Update `CLIENT_URL`:
   ```
   CLIENT_URL=https://finance-tracker-xyz.vercel.app
   ```
4. Railway will auto-redeploy

---

## ✅ Verification

### Test Backend
Visit: `https://your-backend.railway.app/api/health`

Should show:
```json
{
  "status": "OK",
  "message": "Finance Tracker API is running",
  "database": "connected"
}
```

### Test Frontend
1. Open: `https://your-frontend.vercel.app`
2. Click "Inscrivez-vous" (Register)
3. Create account:
   - Name: Test User
   - Email: test@test.com
   - Password: Test123456
4. Should redirect to dashboard ✅

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Wait 2-3 minutes after creating user
- Check IP whitelist (0.0.0.0/0)
- Verify password has no spaces

### CORS Error
- Make sure `CLIENT_URL` matches Vercel URL exactly
- No trailing slash
- Redeploy backend after changing

### Build Failed
- Check Railway/Vercel logs
- Verify all dependencies in package.json
- Test build locally first: `npm run build`

---

## 📝 Final Checklist

- [ ] MongoDB user created and IP whitelisted
- [ ] Railway backend deployed
- [ ] Backend domain generated
- [ ] Frontend .env.production updated
- [ ] Vercel frontend deployed
- [ ] Railway CLIENT_URL updated with Vercel URL
- [ ] Backend health endpoint working
- [ ] Frontend loads correctly
- [ ] Can register new user
- [ ] Can login
- [ ] Dashboard displays

---

## 🔗 Your URLs (Fill These In)

**Backend (Railway)**: ___________________________________

**Frontend (Vercel)**: ___________________________________

**MongoDB Cluster**: cluster0.ottcut8.mongodb.net ✅

---

## Need Help?

1. Check deployment logs first
2. Verify environment variables
3. Test MongoDB connection from Railway logs
4. Check browser console for errors

Railway Logs: `railway logs` or in Dashboard → Deployments → Logs
