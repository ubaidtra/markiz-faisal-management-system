const mongoose = require('mongoose');

const quranProgressSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  surah: {
    type: String,
    required: true
  },
  fromAyah: {
    type: Number,
    required: true
  },
  toAyah: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['memorized', 'in-progress', 'review'],
    default: 'in-progress'
  },
  memorizationDate: {
    type: Date
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  lastReviewDate: {
    type: Date
  },
  notes: {
    type: String
  },
  grade: {
    type: String,
    enum: ['excellent', 'good', 'satisfactory', 'needs-improvement']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuranProgress', quranProgressSchema);

