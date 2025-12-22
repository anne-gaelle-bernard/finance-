# MongoDB Atlas Connection Test Failed ❌

## Problem

Your MongoDB connection string has issues:
- **`your-username`** needs to be replaced with your actual username
- The cluster URL `cluster0.rqiea.mongodb.net` may be incorrect

## ✅ How to Get the Correct Connection String

### Step 1: Go to MongoDB Atlas
Visit: https://cloud.mongodb.com

### Step 2: Get Your Connection String
1. Click **"Connect"** on your cluster
2. Select **"Connect your application"**
3. Choose **Driver: Node.js** and **Version: 5.5 or later**
4. Copy the connection string

It will look like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### Step 3: Update Your `.env` File

Replace the `MONGODB_URI` in `backend/.env` with:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:6949bf57321d927240697557@YOUR_CLUSTER.mongodb.net/finance-tracker?retryWrites=true&w=majority&appName=Cluster0
```

**Replace:**
- `YOUR_USERNAME` - Your MongoDB Atlas database username
- `YOUR_CLUSTER` - The actual cluster URL from Atlas (e.g., `cluster0.abc12.mongodb.net`)

### Step 4: Whitelist Your IP Address

1. In MongoDB Atlas, go to **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds 0.0.0.0/0)
4. Click **Confirm**

### Step 5: Test Connection Again

```bash
cd backend
node test-mongodb.js
```

## 🔐 Security Notes

- The password `6949bf57321d927240697557` is visible in your request
- Make sure this is a database user password, not your Atlas account password
- Create a database user in Atlas: **Database Access** → **Add New Database User**

## Alternative: Use a Different MongoDB Provider

If you don't have MongoDB Atlas:

1. **Create Free Account**: https://www.mongodb.com/cloud/atlas/register
2. **Create Free Cluster** (M0 - Free tier)
3. **Create Database User**
4. **Get Connection String**

## Need Help?

Run the test again after updating .env:
```bash
node test-mongodb.js
```
