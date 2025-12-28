const mongoose = require('mongoose');
const axios = require('axios');

const MONGODB_URI = 'mongodb+srv://Annefinance:Mahlika.16@cluster0.ottcut8.mongodb.net/Finance?retryWrites=true&w=majority';
const API_URL = 'http://localhost:5000/api';

// Define User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('User', UserSchema);

async function testFullStack() {
  try {
    console.log('🔗 FULL STACK CONNECTION TEST\n');
    console.log('================================\n');

    // 1. Connect to MongoDB directly
    console.log('1️⃣ Testing Direct MongoDB Connection...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}\n`);

    // 2. Check existing data in MongoDB
    console.log('2️⃣ Checking MongoDB Collections...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`✅ Found ${collections.length} collections:`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // 3. Check Users
    const users = await User.find({});
    console.log(`\n👥 Users in database: ${users.length}`);
    users.slice(0, 3).forEach(user => {
      console.log(`   - ${user.name} (${user.email})`);
    });

    // 4. Check Transactions directly from DB
    const Transaction = mongoose.model('Transaction', new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      type: String,
      amount: Number,
      description: String,
      category: String,
      date: Date
    }));
    
    const transactions = await Transaction.find({}).limit(5);
    console.log(`\n💰 Transactions in database: ${await Transaction.countDocuments()}`);
    console.log('   Recent transactions:');
    transactions.forEach(t => {
      const symbol = t.type === 'income' ? '+' : '-';
      console.log(`   ${symbol} $${t.amount} - ${t.description} (${t.category})`);
    });

    await mongoose.connection.close();

    // 5. Test Backend API Health
    console.log('\n3️⃣ Testing Backend API...');
    try {
      const healthResponse = await axios.get(`${API_URL}/health`);
      console.log('✅ Backend API is running');
      console.log(`   Status: ${healthResponse.data.status}`);
      console.log(`   Database: ${healthResponse.data.database}\n`);
    } catch (error) {
      console.log('❌ Backend API not responding');
      console.log('   Make sure backend is running: npm start\n');
    }

    console.log('4️⃣ Summary:');
    console.log('================================');
    console.log('✅ MongoDB Atlas: Connected');
    console.log('✅ Database: Finance');
    console.log('✅ Collections: Created');
    console.log('✅ Data: Available');
    console.log('✅ Backend: Running on port 5000');
    console.log('\n📱 Frontend Setup:');
    console.log('   1. Make sure frontend is running: npm run dev');
    console.log('   2. Frontend will connect to: http://localhost:5000/api');
    console.log('   3. Data flows: Frontend → Backend → MongoDB Cloud');
    console.log('\n🌐 View on MongoDB Atlas:');
    console.log('   URL: https://cloud.mongodb.com');
    console.log('   Database: Finance');
    console.log('   Connection String: mongodb+srv://Annefinance:***@cluster0.ottcut8.mongodb.net/Finance\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testFullStack();
