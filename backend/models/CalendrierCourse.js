const mongoose = require('mongoose');

const CalendrierCourseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  titre: {
    type: String,
    required: [true, 'Veuillez ajouter un titre'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas depasser 200 caracteres']
  },
  info: {
    type: String,
    trim: true,
    maxlength: [1000, 'Les informations ne peuvent pas depasser 1000 caracteres'],
    default: ''
  },
  date: {
    type: Date,
    required: [true, 'Veuillez ajouter une date'],
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CalendrierCourse', CalendrierCourseSchema);
