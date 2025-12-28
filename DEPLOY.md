# 🚀 Complete Deployment Guide - Finance Tracker

## Overview
- **Backend**: Railway (Node.js + MongoDB)
- **Frontend**: Vercel (React + Vite)
- **Database**: MongoDB Atlas

---

## Part 1: Deploy Backend to Railway

### Step 1: Commit Your Changes
```bash
git add .
git commit -m "Fix login and register functionality"
git push origin main
```

### Step 2: Login to Railway
```bash
railway login
```
This will open your browser for authentication.

### Step 3: Create New Project
```bash
cd backend
railway init
```
- Select "Create new project"
- Name it: `finance-tracker-backend`

### Step 4: Link to GitHub (Recommended)
In Railway Dashboard:
1. Go to your project
2. Click "New" → "GitHub Repo"
3. Connect your repository
4. Select the `backend` directory as root

### Step 5: Set Environment Variables
In Railway Dashboard → Variables, add:

```env
NODE_ENV=production
JWT_SECRET=5cd7e37a-8791-4d66-8d5c-514831dc4dc6
MONGODB_URI=mongodb+srv://Annefinance:Mahlika.16@cluster0.ottcut8.mongodb.net/Finance?retryWrites=true&w=majority
CLIENT_URL=https://your-frontend-url.vercel.app
PORT=5000
```

**⚠️ Important**: Replace `CLIENT_URL` after deploying frontend

### Step 6: Configure Build Settings
Railway should auto-detect Node.js. Verify:
- **Root Directory**: `/backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Port**: 5000

### Step 7: Deploy
```bash
railway up
```

Or click "Deploy" in Railway Dashboard.

### Step 8: Get Your Backend URL
```bash
railway domain
```
Example: `https://finance-backend-production.up.railway.app`

**Save this URL!** You'll need it for frontend.

### Step 9: Test Backend
Visit: `https://your-backend.railway.app/api/health`

Should return:
```json
{
  "status": "OK",
  "message": "Finance Tracker API is running",
  "database": "connected"
}
```

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Production Environment
Edit `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend.railway.app/api
```

**Replace** `your-backend.railway.app` with your actual Railway URL.

### Step 2: Commit Changes
```bash
git add frontend/.env.production
git commit -m "Update production API URL"
git push origin main
```

### Step 3: Login to Vercel
```bash
cd frontend
vercel login
```

### Step 4: Deploy to Vercel
```bash
vercel --prod
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Your account
- **Link to existing project**: No
- **Project name**: `finance-tracker`
- **Directory**: `./` (current directory)
- **Override settings**: No

### Step 5: Get Your Frontend URL
After deployment completes, you'll see:
```
✅ Production: https://finance-tracker-xyz.vercel.app
```

**Save this URL!**

### Step 6: Update Backend CORS
Go back to Railway Dashboard:
1. Open your backend project
2. Go to Variables
3. Update `CLIENT_URL` to your Vercel URL:
   ```
   CLIENT_URL=https://finance-tracker-xyz.vercel.app
   ```
4. Redeploy backend (Railway will auto-redeploy)

---

## Part 3: MongoDB Atlas Configuration

### Step 1: Configure Network Access
1. Go to MongoDB Atlas Dashboard
2. Click "Network Access" (left sidebar)
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere" (0.0.0.0/0)
5. Click "Confirm"

**Note**: For better security, you can add Railway's IP ranges instead.

### Step 2: Verify Connection
Check Railway logs:
```bash
railway logs
```

Look for:
```
✅ MongoDB Connected: cluster0.ottcut8.mongodb.net
```

---

## Part 4: Verification & Testing

### ✅ Backend Checklist
- [ ] Railway deployment successful
- [ ] Health endpoint responding: `/api/health`
- [ ] MongoDB connected (check logs)
- [ ] Environment variables set correctly
- [ ] CORS configured with frontend URL

### ✅ Frontend Checklist
- [ ] Vercel deployment successful
- [ ] Site loads correctly
- [ ] API connection working (check browser console)
- [ ] No CORS errors
- [ ] Login/Register functional

### Test Registration
1. Open your Vercel URL
2. Click "Inscrivez-vous" (Register)
3. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: testpassword123
4. Submit and verify:
   - No errors in console
   - Redirected to dashboard
   - User data saved in MongoDB

### Test Login
1. Logout
2. Login with same credentials
3. Verify dashboard loads

---

## Part 5: Continuous Deployment

### Automatic Deployments

**Railway (Backend)**:
- Auto-deploys on push to `main` branch
- Monitors the `backend` directory

**Vercel (Frontend)**:
- Auto-deploys on push to `main` branch
- Monitors the `frontend` directory

### Manual Deployments

**Railway**:
```bash
cd backend
railway up
```

**Vercel**:
```bash
cd frontend
vercel --prod
```

---

## Troubleshooting

### CORS Errors
**Symptom**: "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution**:
1. Verify `CLIENT_URL` in Railway matches your Vercel URL exactly
2. No trailing slash in URL
3. Redeploy backend after changing

### MongoDB Connection Failed
**Symptom**: "MongoDB connection error" in Railway logs

**Solutions**:
1. Check MongoDB Atlas Network Access allows 0.0.0.0/0
2. Verify `MONGODB_URI` is correct (check password encoding)
3. Test connection locally first

### Environment Variables Not Working
**Symptom**: `undefined` values in production

**Solutions**:
1. Verify all variables are set in Railway Dashboard
2. Check variable names match exactly (case-sensitive)
3. Redeploy after adding variables

### 404 on Refresh (Frontend)
**Symptom**: Page refreshes return 404

**Solution**: Already fixed! `vercel.json` rewrites all routes to `index.html`

### Build Failures

**Railway**:
1. Check logs: `railway logs`
2. Verify `package.json` has correct dependencies
3. Check Node version compatibility

**Vercel**:
1. Check build logs in Vercel Dashboard
2. Verify environment variables
3. Test build locally: `npm run build`

---

## Useful Commands

### Railway
```bash
# View logs
railway logs

# Open dashboard
railway open

# Check status
railway status

# SSH into container
railway shell
```

### Vercel
```bash
# View deployments
vercel ls

# Check logs
vercel logs

# Open dashboard
vercel
```

---

## Security Best Practices

1. **Never commit `.env` files**
   - Already in `.gitignore`

2. **Use strong JWT_SECRET**
   - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

3. **Restrict MongoDB Access**
   - Use Railway IP ranges instead of 0.0.0.0/0

4. **Enable HTTPS**
   - Railway and Vercel provide this automatically

5. **Regular Updates**
   ```bash
   npm audit fix
   ```

---

## Cost Estimates

### Free Tier Limits

**Railway**:
- $5 credit/month (free tier)
- ~500 hours runtime
- Enough for small apps

**Vercel**:
- 100 GB bandwidth/month
- Unlimited deployments
- Perfect for personal projects

**MongoDB Atlas**:
- 512 MB storage (free tier)
- Shared cluster
- Good for development

---

## Quick Reference URLs

After deployment, save these:

- **Backend URL**: `https://your-backend.railway.app`
- **Frontend URL**: `https://your-frontend.vercel.app`
- **MongoDB**: `cluster0.ottcut8.mongodb.net`
- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## Support

If you encounter issues:
1. Check logs first (Railway/Vercel dashboards)
2. Verify environment variables
3. Test locally with same config
4. Check MongoDB Atlas connection

**Need help?**
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.atlas.mongodb.com
