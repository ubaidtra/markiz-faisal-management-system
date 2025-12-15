const express = require('express');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Fee = require('../models/Fee');
const Withdrawal = require('../models/Withdrawal');
const Attendance = require('../models/Attendance');
const QuranProgress = require('../models/QuranProgress');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', auth, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ status: 'active' });
    const totalTeachers = await Teacher.countDocuments({ status: 'active' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await Attendance.countDocuments({ 
      date: { $gte: today },
      status: 'present'
    });
    
    const feePayingStudentIds = await Student.find({ paysTuitionFee: { $ne: false } }).distinct('_id');
    const totalFees = await Fee.aggregate([
      { $match: { student: { $in: feePayingStudentIds } } },
      { $group: { _id: null, total: { $sum: '$amount' }, paid: { $sum: '$paidAmount' } } }
    ]);
    
    const totalWithdrawals = await Withdrawal.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const totalMemorized = await QuranProgress.countDocuments({ status: 'memorized' });
    const inProgress = await QuranProgress.countDocuments({ status: 'in-progress' });

    const totalPaid = totalFees[0]?.paid || 0;
    const totalWithdrawn = totalWithdrawals[0]?.total || 0;

    res.json({
      totalStudents,
      totalTeachers,
      todayAttendance,
      totalFees: totalFees[0]?.total || 0,
      totalPaid,
      totalPending: (totalFees[0]?.total || 0) - totalPaid,
      totalWithdrawals: totalWithdrawn,
      netBalance: totalPaid - totalWithdrawn,
      totalMemorized,
      inProgress
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/students', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    
    if (startDate || endDate) {
      query.enrollmentDate = {};
      if (startDate) query.enrollmentDate.$gte = new Date(startDate);
      if (endDate) query.enrollmentDate.$lte = new Date(endDate);
    }

    const students = await Student.find(query);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/withdrawals', auth, authorize('admin', 'accountant'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { status: 'approved' };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const withdrawals = await Withdrawal.find(query);
    
    const report = {
      total: withdrawals.reduce((sum, w) => sum + w.amount, 0),
      byCategory: {}
    };

    withdrawals.forEach(w => {
      report.byCategory[w.category] = (report.byCategory[w.category] || 0) + w.amount;
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/fees', auth, authorize('admin', 'accountant'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    
    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) query.dueDate.$gte = new Date(startDate);
      if (endDate) query.dueDate.$lte = new Date(endDate);
    }

    const fees = await Fee.find(query).populate('student', 'firstName lastName studentId');
    
    const report = {
      totalAmount: fees.reduce((sum, f) => sum + f.amount, 0),
      totalPaid: fees.reduce((sum, f) => sum + f.paidAmount, 0),
      totalPending: fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + (f.amount - f.paidAmount), 0),
      totalOverdue: fees.filter(f => f.status === 'overdue').reduce((sum, f) => sum + (f.amount - f.paidAmount), 0),
      feesByType: {},
      feesByStatus: {}
    };

    fees.forEach(fee => {
      report.feesByType[fee.feeType] = (report.feesByType[fee.feeType] || 0) + fee.amount;
      report.feesByStatus[fee.status] = (report.feesByStatus[fee.status] || 0) + (fee.amount - fee.paidAmount);
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/attendance', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query).populate('student', 'firstName lastName studentId');
    
    const report = {
      totalRecords: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      late: attendance.filter(a => a.status === 'late').length,
      excused: attendance.filter(a => a.status === 'excused').length
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/quran-progress', auth, async (req, res) => {
  try {
    const progress = await QuranProgress.find()
      .populate('student', 'firstName lastName studentId')
      .populate('teacher', 'firstName lastName teacherId');
    
    const report = {
      totalRecords: progress.length,
      memorized: progress.filter(p => p.status === 'memorized').length,
      inProgress: progress.filter(p => p.status === 'in-progress').length,
      underReview: progress.filter(p => p.status === 'review').length,
      bySurah: {}
    };

    progress.forEach(p => {
      report.bySurah[p.surah] = (report.bySurah[p.surah] || 0) + 1;
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

