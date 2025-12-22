# MongoDB Atlas Setup for Finance Tracker

## Configuration

Your MongoDB Atlas connection is configured in the `.env` file:

```
MONGODB_URI=mongodb+srv://your-username:6949bf57321d927240697557@cluster0.rqiea.mongodb.net/finance-tracker?retryWrites=true&w=majority&appName=Cluster0
```

## ⚠️ Important: Update Connection String

Replace `your-username` in the connection string with your actual MongoDB Atlas username.

The full format is:
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER/DATABASE
```

## Models Created

✅ **User** - User accounts with authentication
✅ **Transaction** - Income and expense tracking  
✅ **Folder** - Receipt folders with embedded receipts
✅ **Goal** - Financial goals tracking
✅ **Reminder** - Payment reminders
✅ **Note** - Quick notes

## Database Features

- **Indexes** for optimized queries
- **Validation** on required fields
- **Auto-calculation** of folder totals
- **Timestamps** (createdAt, updatedAt)
- **User isolation** via userId references

## Next Steps

1. **Update .env file** with correct MongoDB Atlas username
2. **Restart server**: `npm run dev`
3. **Test connection** - server will show "✅ MongoDB Connected"
4. **Update frontend** to use API endpoints instead of localStorage

## API Endpoints Ready

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create transaction
- Similar routes for folders, goals, reminders, notes

## Connection Status

Check server logs for:
- ✅ MongoDB Connected: cluster0-shard-00-00.rqiea.mongodb.net
- 📊 Database: finance-tracker

If you see connection errors, verify:
1. Username in connection string
2. Password is correct (6949bf57321d927240697557)
3. IP whitelist in MongoDB Atlas (allow 0.0.0.0/0 for development)
4. Network/firewall not blocking MongoDB ports
