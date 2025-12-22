const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('🔍 Testing MongoDB Atlas Connection...\n');
console.log('MongoDB URI:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@')); // Hide password
console.log('');

const testConnection = async () => {
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('\n✅ SUCCESS! MongoDB Connected');
    console.log('📊 Database Name:', conn.connection.name);
    console.log('🖥️  Host:', conn.connection.host);
    console.log('🔌 Port:', conn.connection.port);
    console.log('📡 Ready State:', conn.connection.readyState === 1 ? 'Connected' : 'Not Connected');
    
    // Test a simple operation
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('\n📁 Collections in database:', collections.length);
    if (collections.length > 0) {
      collections.forEach(col => console.log('   -', col.name));
    } else {
      console.log('   (No collections yet - database is empty)');
    }
    
    console.log('\n✨ Connection test completed successfully!\n');
    
    await mongoose.connection.close();
    console.log('🔒 Connection closed.');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ CONNECTION FAILED!');
    console.error('Error:', error.message);
    console.error('\n📋 Troubleshooting:');
    console.error('1. Verify your MongoDB Atlas cluster exists');
    console.error('2. Check username and password are correct');
    console.error('3. Ensure IP address is whitelisted (0.0.0.0/0 for all)');
    console.error('4. Verify the cluster URL format');
    console.error('5. Check your internet connection\n');
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('💡 The cluster URL appears to be incorrect.');
      console.error('   Get the correct URL from MongoDB Atlas:');
      console.error('   1. Go to https://cloud.mongodb.com');
      console.error('   2. Click "Connect" on your cluster');
      console.error('   3. Choose "Connect your application"');
      console.error('   4. Copy the connection string\n');
    }
    
    process.exit(1);
  }
};

testConnection();
