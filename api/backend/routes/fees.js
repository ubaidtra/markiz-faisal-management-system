const express = require('express');
const Fee = require('../models/Fee');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { student, status, feeType, startDate, endDate } = req.query;
    const query = {};
    
    if (student) query.student = student;
    if (status) query.status = status;
    if (feeType) query.feeType = feeType;
    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) query.dueDate.$gte = new Date(startDate);
      if (endDate) query.dueDate.$lte = new Date(endDate);
    }

    const fees = await Fee.find(query)
      .populate('student', 'firstName lastName studentId')
      .populate('recordedBy', 'name username')
      .sort({ dueDate: -1 });
    
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id)
      .populate('student', 'firstName lastName studentId')
      .populate('recordedBy', 'name username');
    
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', auth, authorize('admin', 'accountant'), async (req, res) => {
  try {
    const fee = new Fee({
      ...req.body,
      recordedBy: req.user._id
    });
    await fee.save();
    await fee.populate('student', 'firstName lastName studentId');
    await fee.populate('recordedBy', 'name username');
    res.status(201).json(fee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', auth, authorize('admin', 'accountant'), async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }

    if (req.body.paidAmount) {
      fee.paidAmount = req.body.paidAmount;
      if (fee.paidAmount >= fee.amount) {
        fee.status = 'paid';
        fee.paidDate = new Date();
      } else if (fee.paidAmount > 0) {
        fee.status = 'partial';
      }
    }

    Object.assign(fee, req.body);
    await fee.save();
    await fee.populate('student', 'firstName lastName studentId');
    await fee.populate('recordedBy', 'name username');
    
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }
    res.json({ message: 'Fee record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/student/:studentId/summary', auth, async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.params.studentId });
    
    const summary = {
      totalFees: fees.reduce((sum, f) => sum + f.amount, 0),
      totalPaid: fees.reduce((sum, f) => sum + f.paidAmount, 0),
      totalPending: fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + (f.amount - f.paidAmount), 0),
      totalOverdue: fees.filter(f => f.status === 'overdue').reduce((sum, f) => sum + (f.amount - f.paidAmount), 0),
      pendingCount: fees.filter(f => f.status === 'pending').length,
      paidCount: fees.filter(f => f.status === 'paid').length,
      overdueCount: fees.filter(f => f.status === 'overdue').length
    };
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

