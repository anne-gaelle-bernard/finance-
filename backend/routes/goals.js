const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../models/database');

router.get('/', auth, (req, res) => {
  try {
    const goals = db.getGoalsByUserId(req.userId);
    res.json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, (req, res) => {
  try {
    const goal = {
      id: Date.now().toString(),
      userId: req.userId,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const created = db.createGoal(goal);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', auth, (req, res) => {
  try {
    const updated = db.updateGoal(req.params.id, req.userId, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', auth, (req, res) => {
  try {
    const deleted = db.deleteGoal(req.params.id, req.userId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
