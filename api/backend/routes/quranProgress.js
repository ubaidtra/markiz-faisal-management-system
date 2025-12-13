const express = require('express');
const QuranProgress = require('../models/QuranProgress');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { student, teacher, status, surah } = req.query;
    const query = {};
    
    if (student) query.student = student;
    if (teacher) query.teacher = teacher;
    if (status) query.status = status;
    if (surah) query.surah = { $regex: surah, $options: 'i' };

    const progress = await QuranProgress.find(query)
      .populate('student', 'firstName lastName studentId')
      .populate('teacher', 'firstName lastName teacherId')
      .sort({ createdAt: -1 });
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const progress = await QuranProgress.findById(req.params.id)
      .populate('student', 'firstName lastName studentId')
      .populate('teacher', 'firstName lastName teacherId');
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress record not found' });
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const progress = new QuranProgress(req.body);
    await progress.save();
    await progress.populate('student', 'firstName lastName studentId');
    await progress.populate('teacher', 'firstName lastName teacherId');
    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const progress = await QuranProgress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('student', 'firstName lastName studentId')
     .populate('teacher', 'firstName lastName teacherId');
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress record not found' });
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const progress = await QuranProgress.findByIdAndDelete(req.params.id);
    if (!progress) {
      return res.status(404).json({ message: 'Progress record not found' });
    }
    res.json({ message: 'Progress record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/student/:studentId/summary', auth, async (req, res) => {
  try {
    const progress = await QuranProgress.find({ student: req.params.studentId });
    
    const summary = {
      totalMemorized: progress.filter(p => p.status === 'memorized').length,
      inProgress: progress.filter(p => p.status === 'in-progress').length,
      underReview: progress.filter(p => p.status === 'review').length,
      totalRecords: progress.length,
      lastUpdated: progress.length > 0 ? progress[0].updatedAt : null
    };
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

