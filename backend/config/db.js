const mongoose = require('mongoose');

const connectDB = async (retries = 5) => {
  const uri = process.env.MONGODB_URI;
  
  console.log('🔍 MONGODB_URI exists:', !!uri);
  if (uri) {
    // Log sanitized URI (hide password)
    const sanitized = uri.replace(/:([^@]+)@/, ':****@');
    console.log('🔍 MONGODB_URI (sanitized):', sanitized);
  } else {
    console.error('❌ MONGODB_URI is not set! Please set it in environment variables.');
    return;
  }

  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);
      return;
    } catch (error) {
      console.error(`❌ MongoDB Connection Attempt ${i + 1}/${retries} failed: ${error.message}`);
      if (i < retries - 1) {
        const delay = Math.min(1000 * Math.pow(2, i), 10000);
        console.log(`⏳ Retrying in ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('⚠️  All connection attempts failed. Server will start without database.');
      }
    }
  }
};

module.exports = connectDB;
