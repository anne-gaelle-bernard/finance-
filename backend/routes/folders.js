const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Folder = require('../models/Folder');

// Get all folders for user
router.get('/', auth, async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: folders });
  } catch (error) {
    console.error('Get folders error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new folder
router.post('/', auth, async (req, res) => {
  try {
    const folder = new Folder({
      userId: req.userId,
      name: req.body.name,
      color: req.body.color || 'pink',
      receipts: req.body.receipts || []
    });
    
    await folder.save();
    res.status(201).json({ success: true, data: folder });
  } catch (error) {
    console.error('Create folder error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update folder
router.put('/:id', auth, async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    folder.name = req.body.name || folder.name;
    folder.color = req.body.color || folder.color;
    
    if (req.body.receipts) {
      folder.receipts = req.body.receipts;
    }
    
    await folder.save();
    res.json({ success: true, data: folder });
  } catch (error) {
    console.error('Update folder error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Add receipt to folder
router.post('/:id/receipts', auth, async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    folder.receipts.push(req.body);
    await folder.save();
    
    res.status(201).json({ success: true, data: folder });
  } catch (error) {
    console.error('Add receipt error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete receipt from folder
router.delete('/:id/receipts/:receiptId', auth, async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    folder.receipts = folder.receipts.filter(r => r._id.toString() !== req.params.receiptId);
    await folder.save();
    
    res.json({ success: true, data: folder });
  } catch (error) {
    console.error('Delete receipt error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete folder
router.delete('/:id', auth, async (req, res) => {
  try {
    const folder = await Folder.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }
    
    res.json({ success: true, message: 'Folder deleted' });
  } catch (error) {
    console.error('Delete folder error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
