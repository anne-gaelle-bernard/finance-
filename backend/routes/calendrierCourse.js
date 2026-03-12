const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CalendrierCourse = require('../models/CalendrierCourse');

// GET - Recuperer toutes les courses du calendrier
router.get('/', auth, async (req, res) => {
  try {
    const courses = await CalendrierCourse.find({ userId: req.userId }).sort({ date: 1 });
    res.json({ success: true, data: courses });
  } catch (error) {
    console.error('Get calendrier courses error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Recuperer les courses par date
router.get('/by-date/:date', auth, async (req, res) => {
  try {
    const targetDate = new Date(req.params.date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    const courses = await CalendrierCourse.find({
      userId: req.userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ date: 1 });
    res.json({ success: true, data: courses });
  } catch (error) {
    console.error('Get courses by date error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Creer une nouvelle course
router.post('/', auth, async (req, res) => {
  try {
    const course = new CalendrierCourse({
      userId: req.userId,
      ...req.body
    });
    await course.save();
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT - Mettre a jour une course
router.put('/:id', auth, async (req, res) => {
  try {
    const course = await CalendrierCourse.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course non trouvee' });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE - Supprimer une course
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await CalendrierCourse.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course non trouvee' });
    }
    res.json({ success: true, message: 'Course supprimee' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
