const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://Annefinance:Mahlika.16@cluster0.ottcut8.mongodb.net/Finance?retryWrites=true&w=majority';

// Define test schemas
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  createdAt: { type: Date, default: Date.now }
});

const TransactionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String,
  amount: Number,
  description: String,
  category: String,
  date: Date,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);

async function testDatabase() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas!\n');

    // Clear test data first
    console.log('🧹 Cleaning up old test data...');
    await User.deleteMany({ email: 'test@example.com' });
    await Transaction.deleteMany({ description: { $regex: /^Test/ } });

    // Create test user
    console.log('👤 Creating test user...');
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password_here'
    });
    console.log('✅ User created:', {
      id: testUser._id,
      name: testUser.name,
      email: testUser.email
    });

    // Create test transactions
    console.log('\n💰 Creating test transactions...');
    const transactions = await Transaction.insertMany([
      {
        userId: testUser._id,
        type: 'income',
        amount: 2500.00,
        description: 'Test Salary',
        category: 'Salary',
        date: new Date()
      },
      {
        userId: testUser._id,
        type: 'expense',
        amount: 45.50,
        description: 'Test Grocery Shopping',
        category: 'Food',
        date: new Date()
      },
      {
        userId: testUser._id,
        type: 'expense',
        amount: 120.00,
        description: 'Test Electric Bill',
        category: 'Utilities',
        date: new Date()
      },
      {
        userId: testUser._id,
        type: 'income',
        amount: 150.00,
        description: 'Test Freelance Work',
        category: 'Freelance',
        date: new Date()
      }
    ]);
    console.log(`✅ Created ${transactions.length} transactions`);

    // Retrieve and display data
    console.log('\n📊 Retrieving data from database...');
    const allUsers = await User.find({});
    const allTransactions = await Transaction.find({ userId: testUser._id });

    console.log('\n👥 Users in database:', allUsers.length);
    allUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email})`);
    });

    console.log('\n💸 Transactions for test user:');
    allTransactions.forEach(trans => {
      const symbol = trans.type === 'income' ? '+' : '-';
      console.log(`  ${symbol} $${trans.amount.toFixed(2)} - ${trans.description} (${trans.category})`);
    });

    // Calculate totals
    const totalIncome = allTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = allTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    console.log('\n📈 Summary:');
    console.log(`  Total Income:   $${totalIncome.toFixed(2)}`);
    console.log(`  Total Expenses: $${totalExpenses.toFixed(2)}`);
    console.log(`  Balance:        $${(totalIncome - totalExpenses).toFixed(2)}`);

    console.log('\n✅ Database test completed successfully!');
    console.log('\n🌐 View your data at: https://cloud.mongodb.com');
    console.log('   Database: Finance');
    console.log('   Collections: users, transactions');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the test
testDatabase();
