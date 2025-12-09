const express = require('express');
const Teacher = require('../models/Teacher');
const { auth, authorize } = require('../middleware/auth');
const { generateTeacherId } = require('../utils/idGenerator');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { teacherId: { $regex: search, $options: 'i' } }
      ];
    }

    const teachers = await Teacher.find(query).sort({ createdAt: -1 });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const teacherData = req.body;
    
    if (!teacherData.teacherId) {
      teacherData.teacherId = await generateTeacherId();
    }
    
    const teacher = new Teacher(teacherData);
    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern.teacherId) {
        teacherData.teacherId = await generateTeacherId();
        try {
          const teacher = new Teacher(teacherData);
          await teacher.save();
          return res.status(201).json(teacher);
        } catch (retryError) {
          return res.status(500).json({ message: 'Server error', error: retryError.message });
        }
      }
      return res.status(400).json({ message: 'Teacher ID already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

