const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Parse CSV data
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',');
    const row = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] ? values[index].trim() : '';
    });
    
    data.push(row);
  }

  return data;
}

// POST /api/transactions/import - Upload and import CSV
router.post('/import', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    // Convert buffer to string
    const csvText = req.file.buffer.toString('utf-8');
    
    // Parse CSV
    const rows = parseCSV(csvText);
    
    if (rows.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'CSV file is empty or invalid' 
      });
    }

    const results = {
      total: rows.length,
      imported: 0,
      failed: 0,
      errors: []
    };

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      try {
        // Validate required fields
        if (!row.type || !row.amount || !row.description || !row.category) {
          results.failed++;
          results.errors.push({
            row: i + 2, // +2 because: +1 for header, +1 for 0-index
            error: 'Missing required fields (type, amount, description, category)'
          });
          continue;
        }

        // Validate type
        const type = row.type.toLowerCase();
        if (type !== 'income' && type !== 'expense') {
          results.failed++;
          results.errors.push({
            row: i + 2,
            error: `Invalid type "${row.type}". Must be "income" or "expense"`
          });
          continue;
        }

        // Parse and validate amount
        const amount = parseFloat(row.amount);
        if (isNaN(amount) || amount <= 0) {
          results.failed++;
          results.errors.push({
            row: i + 2,
            error: `Invalid amount "${row.amount}"`
          });
          continue;
        }

        // Parse date
        let date = new Date();
        if (row.date) {
          const parsedDate = new Date(row.date);
          if (!isNaN(parsedDate.getTime())) {
            date = parsedDate;
          }
        }

        // Create transaction
        const transaction = await Transaction.create({
          userId: req.userId,
          type,
          amount,
          description: row.description,
          category: row.category,
          date
        });

        results.imported++;

      } catch (error) {
        results.failed++;
        results.errors.push({
          row: i + 2,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `Import complete: ${results.imported} imported, ${results.failed} failed`,
      data: results
    });

  } catch (error) {
    console.error('CSV import error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to import CSV: ' + error.message 
    });
  }
});

// GET /api/transactions/export - Export transactions to CSV
router.get('/export', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId })
      .sort({ date: -1 });

    // Create CSV
    const headers = 'date,description,amount,category,type\n';
    const rows = transactions.map(t => {
      const date = new Date(t.date).toISOString().split('T')[0];
      return `${date},${t.description},${t.amount},${t.category},${t.type}`;
    }).join('\n');

    const csv = headers + rows;

    // Send as downloadable file
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(csv);

  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to export CSV: ' + error.message 
    });
  }
});

module.exports = router;
