# Environment Variables for Railway Deployment

## Required Environment Variables

Set these in your Railway project settings:

### Backend Variables

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.rqiea.mongodb.net/finance-tracker?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secure-random-string-min-32-characters
CLIENT_URL=https://your-frontend-domain.vercel.app
```

### Frontend Variables

Create a `.env.production` file in frontend:

```
VITE_API_URL=https://your-backend.railway.app/api
```

## Railway Deployment Steps

### Backend Deployment (Railway)

1. **Create Railway Project**
   ```bash
   railway login
   railway init
   ```

2. **Set Environment Variables**
   - Go to Railway dashboard
   - Click on your project
   - Go to "Variables" tab
   - Add all backend variables above

3. **Deploy**
   ```bash
   railway up
   ```

### Frontend Deployment (Vercel/Netlify)

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

   Or **Deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

3. **Set Environment Variable**
   - Add `VITE_API_URL` in deployment settings
   - Point to your Railway backend URL

## MongoDB Atlas Configuration

1. **Whitelist Railway IPs**
   - In MongoDB Atlas, go to Network Access
   - Add IP: `0.0.0.0/0` (allow all) for Railway
   - Or add specific Railway IPs if provided

2. **Database User**
   - Ensure database user has read/write permissions
   - Use the password in MONGODB_URI

## Security Checklist

- ✅ Change JWT_SECRET to a strong random string
- ✅ Update MONGODB_URI with real credentials
- ✅ Set CLIENT_URL to production frontend URL
- ✅ Set NODE_ENV to 'production'
- ✅ Enable MongoDB network access for Railway
- ✅ Never commit .env file to git

## Testing Production

1. **Test Backend Health**
   ```bash
   curl https://your-backend.railway.app/api/health
   ```

2. **Test Authentication**
   - Register a user via frontend
   - Login and verify JWT token
   - Test protected routes

3. **Monitor Logs**
   ```bash
   railway logs
   ```

## Troubleshooting

- **MongoDB Connection Error**: Check Network Access in Atlas
- **CORS Error**: Verify CLIENT_URL matches frontend domain
- **500 Errors**: Check Railway logs with `railway logs`
- **Port Issues**: Railway auto-assigns PORT, ensure server uses `process.env.PORT`
