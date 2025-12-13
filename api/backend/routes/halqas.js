const express = require('express');
const Halqa = require('../models/Halqa');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { status, teacher, search } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (teacher) query.teacher = teacher;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const halqas = await Halqa.find(query)
      .populate('teacher', 'firstName lastName teacherId')
      .populate('students', 'firstName lastName studentId')
      .populate('createdBy', 'name username')
      .sort({ createdAt: -1 });
    
    res.json(halqas);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const halqa = await Halqa.findById(req.params.id)
      .populate('teacher', 'firstName lastName teacherId phone email')
      .populate('students', 'firstName lastName studentId class parentName parentPhone')
      .populate('createdBy', 'name username');
    
    if (!halqa) {
      return res.status(404).json({ message: 'Halqa not found' });
    }
    res.json(halqa);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const halqa = new Halqa({
      ...req.body,
      createdBy: req.user._id
    });
    await halqa.save();
    await halqa.populate('teacher', 'firstName lastName teacherId');
    await halqa.populate('students', 'firstName lastName studentId');
    res.status(201).json(halqa);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const halqa = await Halqa.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('teacher', 'firstName lastName teacherId')
      .populate('students', 'firstName lastName studentId');
    
    if (!halqa) {
      return res.status(404).json({ message: 'Halqa not found' });
    }
    res.json(halqa);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const halqa = await Halqa.findByIdAndDelete(req.params.id);
    if (!halqa) {
      return res.status(404).json({ message: 'Halqa not found' });
    }
    res.json({ message: 'Halqa deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/:id/students', auth, authorize('admin'), async (req, res) => {
  try {
    const { studentIds } = req.body;
    const halqa = await Halqa.findById(req.params.id);
    
    if (!halqa) {
      return res.status(404).json({ message: 'Halqa not found' });
    }

    if (halqa.students.length + studentIds.length > halqa.maxStudents) {
      return res.status(400).json({ 
        message: `Cannot add more students. Maximum capacity is ${halqa.maxStudents}` 
      });
    }

    halqa.students = [...new Set([...halqa.students.map(s => s.toString()), ...studentIds])];
    await halqa.save();
    
    await halqa.populate('students', 'firstName lastName studentId');
    res.json(halqa);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id/students/:studentId', auth, authorize('admin'), async (req, res) => {
  try {
    const halqa = await Halqa.findById(req.params.id);
    
    if (!halqa) {
      return res.status(404).json({ message: 'Halqa not found' });
    }

    halqa.students = halqa.students.filter(
      s => s.toString() !== req.params.studentId
    );
    await halqa.save();
    
    await halqa.populate('students', 'firstName lastName studentId');
    res.json(halqa);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

