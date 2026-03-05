const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// SECURITY MIDDLEWARE
// ============================================================

// 1. Helmet - HTTP security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// 2. CORS - Strict origin whitelist
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://finance-gazy.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (native mobile apps)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/finance-gazy-.*-anne-gaelle-bernards-projects\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}));

// 3. Body size limit - prevent DoS via large payloads
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. MongoDB injection sanitization
app.use(mongoSanitize());

// 5. Rate limiting - global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Trop de requ\u00eates, r\u00e9essayez dans 15 minutes.' },
});
app.use('/api/', globalLimiter);

// 6. Rate limiting - auth routes (strict anti brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Trop de tentatives de connexion. Attendez 15 minutes.' },
  skipSuccessfulRequests: true,
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ============================================================
// ROUTES
// ============================================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/import', require('./routes/import'));
app.use('/api/folders', require('./routes/folders'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/user', require('./routes/user'));

// Root route
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Finance Tracker API' });
});

// Health check - informations minimales (pas de donn\u00e9es sensibles)
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    status: isConnected ? 'OK' : 'DEGRADED',
    database: isConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// ERROR HANDLING
// ============================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler - ne jamais exposer les d\u00e9tails d'erreur en production
app.use((err, req, res, next) => {
  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'CORS: origine non autoris\u00e9e' });
  }

  console.error('[ERROR]', err.message);

  const isDev = process.env.NODE_ENV === 'development';
  res.status(err.status || 500).json({
    success: false,
    message: isDev ? err.message : 'Une erreur interne est survenue.',
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\ud83d\ude80 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
