const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Reminder = require('../models/Reminder');

router.get('/', auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.userId }).sort({ dueDate: 1 });
    res.json({ success: true, data: reminders });
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const reminder = new Reminder({
      userId: req.userId,
      ...req.body
    });
    await reminder.save();
    res.status(201).json({ success: true, data: reminder });
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!reminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }
    res.json({ success: true, data: reminder });
  } catch (error) {
    console.error('Update reminder error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!reminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }
    res.json({ success: true, message: 'Reminder deleted' });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
