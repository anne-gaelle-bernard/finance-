# Deploy Backend Only to Railway

Railway is configured to deploy only the `backend` directory.

## Option 1: Use railway.toml (Recommended)

The `railway.toml` file is already configured:
- Builds from `backend/` directory
- Runs `npm start` in backend
- Ignores frontend code

## Option 2: Deploy from Backend Directory

```bash
cd backend
railway init
railway up
```

## Option 3: Use Railway Dashboard

1. Create a new project on Railway
2. Connect your GitHub repository
3. In **Settings** → **Build**:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

## Environment Variables

Set these in Railway Dashboard → Variables:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secure-random-string-min-32-characters
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker
CLIENT_URL=https://your-frontend.vercel.app
```

## Verify Deployment

After deployment, test:
```bash
curl https://your-app.railway.app/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Finance Tracker API is running"
}
```
