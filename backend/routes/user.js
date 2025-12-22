const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../models/database');

// Get user profile
router.get('/profile', auth, (req, res) => {
  try {
    const user = db.getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, data: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user profile
router.put('/profile', auth, (req, res) => {
  try {
    const { password, email, ...updates } = req.body; // Don't allow email/password update here
    const updated = db.updateUser(req.userId, updates);
    
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const { password: _, ...userWithoutPassword } = updated;
    res.json({ success: true, data: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
