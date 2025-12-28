const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/import', require('./routes/import'));
app.use('/api/folders', require('./routes/folders'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/user', require('./routes/user'));

// Root route - HTML welcome page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Finance Tracker API</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2563eb; }
        .endpoint { background: #f0f9ff; padding: 10px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #2563eb; }
        .status { color: #16a34a; font-weight: bold; }
        code { background: #e5e7eb; padding: 2px 6px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>💰 Finance Tracker API</h1>
        <p class="status">✅ Status: Running</p>
        <p>Version: 1.0.0</p>
        <h2>Available Endpoints:</h2>
        <div class="endpoint"><strong>GET</strong> <code>/api/health</code> - Health check</div>
        <div class="endpoint"><strong>POST</strong> <code>/api/auth/register</code> - Register user</div>
        <div class="endpoint"><strong>POST</strong> <code>/api/auth/login</code> - Login user</div>
        <div class="endpoint"><strong>GET</strong> <code>/api/transactions</code> - Get transactions</div>
        <div class="endpoint"><strong>GET</strong> <code>/api/folders</code> - Get folders</div>
        <div class="endpoint"><strong>GET</strong> <code>/api/goals</code> - Get goals</div>
        <div class="endpoint"><strong>GET</strong> <code>/api/reminders</code> - Get reminders</div>
        <div class="endpoint"><strong>GET</strong> <code>/api/notes</code> - Get notes</div>
        <div class="endpoint"><strong>GET</strong> <code>/api/user</code> - Get user profile</div>
      </div>
    </body>
    </html>
  `);
});

// Health check
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({ 
    status: 'OK', 
    message: 'Finance Tracker API is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`CORS Origin: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});
