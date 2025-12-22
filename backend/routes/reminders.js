const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../models/database');

router.get('/', auth, (req, res) => {
  try {
    const reminders = db.getRemindersByUserId(req.userId);
    res.json({ success: true, data: reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, (req, res) => {
  try {
    const reminder = {
      id: Date.now().toString(),
      userId: req.userId,
      ...req.body,
      completed: false,
      createdAt: new Date().toISOString()
    };
    const created = db.createReminder(reminder);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', auth, (req, res) => {
  try {
    const updated = db.updateReminder(req.params.id, req.userId, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', auth, (req, res) => {
  try {
    const deleted = db.deleteReminder(req.params.id, req.userId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }
    res.json({ success: true, message: 'Reminder deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
