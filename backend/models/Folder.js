const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  imageUrl: {
    type: String
  },
  scannedAt: {
    type: Date,
    default: Date.now
  }
});

const FolderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Please add a folder name'],
    trim: true
  },
  color: {
    type: String,
    enum: ['rose', 'pink', 'purple', 'blue', 'green', 'yellow'],
    default: 'pink'
  },
  receipts: [ReceiptSchema],
  totalAmount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate total amount before saving
FolderSchema.pre('save', function(next) {
  if (this.receipts && this.receipts.length > 0) {
    this.totalAmount = this.receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
  } else {
    this.totalAmount = 0;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Folder', FolderSchema);
