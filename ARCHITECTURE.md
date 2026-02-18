# 🏗️ Deployment Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRODUCTION DEPLOYMENT                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────┐
│   User Browser       │     │     User Browser     │     │  Mobile Browser  │
│ (Any Location)       │     │  (Any Location)      │     │  (Any Location)  │
└──────────┬───────────┘     └──────────┬───────────┘     └─────────┬────────┘
           │                            │                           │
           │ HTTPS                      │ HTTPS                     │ HTTPS
           │                            │                           │
           └────────────────┬───────────┴───────────┬────────────────┘
                            │                       │
                     ┌──────▼──────────────────────▼──────┐
                     │      VERCEL CDN (Frontend)         │
                     │   finance-tracker-*.vercel.app     │
                     │                                    │
                     │  - React App (Built/Optimized)    │
                     │  - Static Files Cached             │
                     │  - Auto-deploys from GitHub        │
                     └──────┬─────────────────────────────┘
                            │
                            │ HTTPS (CORS enabled)
                            │ API calls to backend
                            │
         ┌──────────────────┴──────────────────┐
         │                                     │
         │  VITE_API_URL Environment Variable  │
         │  Points to Railway Backend          │
         │                                     │
         │ https://project.up.railway.app/api  │
         │                                     │
         └──────────────────┬──────────────────┘
                            │
                            │ HTTPS
                            │
                     ┌──────▼─────────────────────────┐
                     │   RAILWAY (Backend API)        │
                     │   project.up.railway.app       │
                     │                                │
                     │  - Express.js Server           │
                     │  - Port 5000                   │
                     │  - JWT Authentication          │
                     │  - Route Handlers              │
                     │  - Error Handling              │
                     │  - Auto-deploys from GitHub    │
                     │  - Health Check: /api/health   │
                     │                                │
                     │  Environment Variables:        │
                     │  - PORT=5000                   │
                     │  - NODE_ENV=production         │
                     │  - JWT_SECRET=***              │
                     │  - MONGODB_URI=***             │
                     │  - CLIENT_URL=vercel-url       │
                     └──────┬──────────────────────────┘
                            │
                            │ Connection String
                            │
         ┌──────────────────┴──────────────────┐
         │                                     │
         │   MONGODB_URI Environment Variable  │
         │                                     │
         └──────────────────┬──────────────────┘
                            │
                            │ Port 27017
                            │
                     ┌──────▼────────────────────────┐
                     │   MONGODB DATABASE            │
                     │ (Atlas or Railway Service)    │
                     │                               │
                     │  - Collections:               │
                     │    • Users                    │
                     │    • Transactions             │
                     │    • Goals                    │
                     │    • Reminders                │
                     │    • Notes                    │
                     │    • Folders                  │
                     │                               │
                     └────────────────────────────────┘
```

---

## Data Flow

### User Registration Flow
```
Frontend (Vercel)          →  HTTP POST /api/auth/register
                           →  Backend (Railway)
                           →  Hash Password (bcrypt)
                           →  Create User in MongoDB
                           →  Generate JWT Token
                           →  Return Token + User Data
Frontend                   ←  Store Token in localStorage
                           ←  Redirect to Dashboard
```

### User Login Flow
```
Frontend (Vercel)          →  HTTP POST /api/auth/login
                           →  Backend (Railway)
                           →  Find User in MongoDB
                           →  Compare Password (bcrypt)
                           →  Generate JWT Token
                           →  Return Token + User Data
Frontend                   ←  Store Token in localStorage
                           ←  Redirect to Dashboard
```

### API Request With Authentication
```
Frontend                   →  Include Authorization Header
                           →  Bearer {JWT_TOKEN}
                           →  HTTP GET/POST /api/transactions
Backend (Railway)          →  Validate JWT Token
                           →  Extract User ID from Token
                           →  Query MongoDB with User ID
                           →  Return User's Data
Frontend                   ←  Display Data
```

---

## Environment Variables Map

```
┌─────────────────────────────────────────────────────────┐
│  RAILWAY BACKEND ENVIRONMENT VARIABLES                  │
├─────────────────────────────────────────────────────────┤
│ PORT=5000                                               │
│   ↓ Server listens on this port                        │
│   ↓ Railway routes incoming traffic to this port       │
│                                                         │
│ NODE_ENV=production                                     │
│   ↓ Backend runs in production mode                    │
│   ↓ Disables dev tools and extra logging              │
│                                                         │
│ JWT_SECRET=financetracker_secret_xyz                  │
│   ↓ Used to sign and verify JWT tokens                │
│   ↓ Must be kept secret and changed regularly         │
│   ↓ Store in Railway Variables (never in code)        │
│                                                         │
│ MONGODB_URI=mongodb+srv://user:pass@cluster...        │
│   ↓ Connection string to MongoDB                      │
│   ↓ Includes credentials and database name            │
│   ↓ Store in Railway Variables (never in code)        │
│                                                         │
│ CLIENT_URL=https://yourapp.vercel.app                 │
│   ↓ Used for CORS configuration                       │
│   ↓ Frontend domain allowed to call backend API       │
│   ↓ Update after getting Vercel URL                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  VERCEL FRONTEND ENVIRONMENT VARIABLES                  │
├─────────────────────────────────────────────────────────┤
│ VITE_API_URL=https://project.up.railway.app/api        │
│   ↓ Backend API base URL                              │
│   ↓ Frontend uses this for all API calls              │
│   ↓ Configured in .env.production or Vercel dashboard │
│   ↓ Should NOT be changed for same backend            │
└─────────────────────────────────────────────────────────┘
```

---

## Deployments & Auto-Redeploy

```
┌─────────────────────────────────────────────────────────┐
│               GITHUB REPOSITORY                         │
│  (Your code repository)                                 │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   ┌─────────────┐      ┌──────────────┐
   │  RAILWAY    │      │   VERCEL     │
   │ Watches     │      │  Watches     │
   │ GitHub      │      │  GitHub      │
   │             │      │              │
   │ On push:    │      │  On push:    │
   │ 1. Deploy   │      │  1. Deploy   │
   │ 2. Install  │      │  2. Build    │
   │ 3. Start    │      │  3. Serve    │
   │ 4. Health   │      │  4. Ready    │
   │    check    │      │              │
   └─────────────┘      └──────────────┘
        │                     │
        │ Auto               │ Auto
        │ Restart            │ Restart
        │                    │
        ▼                    ▼
    Backend Live         Frontend Live
    (Any Branch)        (Any Branch)
    (All Changes)       (All Changes)
```

---

## CORS Flow

```
Browser                          Backend
   │                                │
   ├─ OPTIONS /api/register ──────▶ │ (Preflight Request)
   │                                │
   │ ◀──── Access-Control-Allow-* ──┤ (CORS Headers)
   │      (Check CLIENT_URL)         │
   │                                │
   ├─ POST /api/register ─────────▶ │ (Actual Request)
   │   Authorization: Bearer token   │ (With Token)
   │                                │
   │ ◀──────── User Data ──────────┤ (Response)
   │          + Token               │
```

**Note**: Backend CORS is configured to allow:
- Origin: `CLIENT_URL` from environment (set to your Vercel URL)
- Credentials: `true` (for cookie and auth header support)
- Headers: Any (for Authorization header)

---

## Database Model Relationships

```
┌──────────────┐
│    User      │ (Email, Name, Preferences)
└──────┬───────┘
       │
       ├────────┬────────┬────────┬─────────┐
       │        │        │        │         │
       ▼        ▼        ▼        ▼         ▼
   ┌────────┐ ┌───────┐ ┌─────┐ ┌──────┐ ┌──────────┐
   │ Trans  │ │ Goals │ │Reminders│ Notes │ Folders│
   │actions │ │       │ │       │        │        │
   └────────┘ └───────┘ └─────┘ └──────┘ └──────────┘
   
   Each record has:
   - userId (links to User)
   - timestamps (created/updated)
   - user-specific data
```

---

## Security Architecture

```
┌────────────────────────────────────────────────────┐
│            SECURITY LAYERS                         │
├────────────────────────────────────────────────────┤
│                                                    │
│  1. HTTPS/TLS (All Communication)                 │
│     ✓ Vercel CDN: HTTPS by default               │
│     ✓ Railway: HTTPS certificates included       │
│     ✓ MongoDB: Encrypted connection option        │
│                                                    │
│  2. JWT Authentication                            │
│     ✓ Tokens signed with JWT_SECRET              │
│     ✓ Tokens stored in localStorage (frontend)   │
│     ✓ Token validated on each request             │
│     ✓ 7-day expiration (configurable)            │
│                                                    │
│  3. Password Hashing (bcrypt)                     │
│     ✓ User passwords never stored in plaintext   │
│     ✓ Password compared via bcrypt.compare()     │
│     ✓ Salt rounds: 10                            │
│                                                    │
│  4. CORS Protection                               │
│     ✓ Only frontend domain can call API          │
│     ✓ Configured via CLIENT_URL variable         │
│     ✓ Preflight checks on all requests           │
│                                                    │
│  5. Environment Variable Protection               │
│     ✓ Secrets stored in Railway Variables        │
│     ✓ Never committed to GitHub                  │
│     ✓ Not exposed in logs                        │
│                                                    │
│  6. Input Validation                              │
│     ✓ Email format validation                     │
│     ✓ Password minimum length                     │
│     ✓ User ID validation (MongoDB ObjectId)      │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## Monitoring & Health Checks

```
┌────────────────────────────────────────────┐
│  HEALTH CHECK ENDPOINT                     │
├────────────────────────────────────────────┤
│                                            │
│  GET /api/health                          │
│                                            │
│  Response:                                 │
│  {                                         │
│    "status": "OK",                        │
│    "message": "API is running",           │
│    "database": "connected|disconnected",   │
│    "timestamp": "ISO 8601 timestamp"      │
│  }                                         │
│                                            │
│  Used by:                                  │
│  - Railway for health checks              │
│  - Status monitoring                      │
│  - Uptime verification                    │
│                                            │
└────────────────────────────────────────────┘
```

---

## Regenerated Files for Deployment

✅ `railway.toml` - Deployment configuration
✅ `nixpacks.toml` - Build configuration
✅ `frontend/.vercelignore` - Vercel ignore file
✅ `.railwayignore` - Railway ignore file
✅ `DEPLOYMENT_COMPLETE.md` - Full guide
✅ `DEPLOYMENT_QUICK_START.md` - Quick reference
✅ `DEPLOYMENT_STATUS.md` - Current status
✅ `README.md` - Updated with deployment info

---

**Ready to Deploy**: ✅ Yes
**Expected Deployment Time**: 10-15 minutes
**Estimated Monthly Cost**: $0 (All services have free tiers)
