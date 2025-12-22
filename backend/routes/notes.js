const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../models/database');

router.get('/', auth, (req, res) => {
  try {
    const notes = db.getNotesByUserId(req.userId);
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, (req, res) => {
  try {
    const note = {
      id: Date.now().toString(),
      userId: req.userId,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const created = db.createNote(note);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', auth, (req, res) => {
  try {
    const updates = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    const updated = db.updateNote(req.params.id, req.userId, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', auth, (req, res) => {
  try {
    const deleted = db.deleteNote(req.params.id, req.userId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
