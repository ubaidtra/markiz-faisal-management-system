const express = require('express');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const { auth, authorize } = require('../middleware/auth');
const { generateStudentId } = require('../utils/idGenerator');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { status, class: studentClass, search } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (studentClass) query.class = studentClass;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const studentData = req.body;
    
    if (!studentData.studentId) {
      studentData.studentId = await generateStudentId();
    }
    
    const student = new Student(studentData);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern.studentId) {
        studentData.studentId = await generateStudentId();
        try {
          const student = new Student(studentData);
          await student.save();
          return res.status(201).json(student);
        } catch (retryError) {
          return res.status(500).json({ message: 'Server error', error: retryError.message });
        }
      }
      return res.status(400).json({ message: 'Student ID already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id/attendance', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { student: req.params.id };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/:id/attendance', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const attendance = new Attendance({
      ...req.body,
      student: req.params.id,
      markedBy: req.user._id
    });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

