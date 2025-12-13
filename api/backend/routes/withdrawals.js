const express = require('express');
const Withdrawal = require('../models/Withdrawal');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { status, category, startDate, endDate, search } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { recipient: { $regex: search, $options: 'i' } },
        { receiptNumber: { $regex: search, $options: 'i' } }
      ];
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const withdrawals = await Withdrawal.find(query)
      .populate('createdBy', 'name username')
      .populate('approvedBy', 'name username')
      .sort({ date: -1, createdAt: -1 });
    
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id)
      .populate('createdBy', 'name username')
      .populate('approvedBy', 'name username');
    
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }
    res.json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', auth, authorize('admin', 'accountant'), async (req, res) => {
  try {
    const withdrawal = new Withdrawal({
      ...req.body,
      createdBy: req.user._id
    });
    await withdrawal.save();
    await withdrawal.populate('createdBy', 'name username');
    res.status(201).json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', auth, authorize('admin', 'accountant'), async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    if (req.body.status && req.body.status === 'approved' && withdrawal.status !== 'approved') {
      withdrawal.approvedBy = req.user._id;
      withdrawal.approvedAt = new Date();
    }

    Object.assign(withdrawal, req.body);
    await withdrawal.save();
    await withdrawal.populate('createdBy', 'name username');
    await withdrawal.populate('approvedBy', 'name username');
    
    res.json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findByIdAndDelete(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }
    res.json({ message: 'Withdrawal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/summary/totals', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { status: 'approved' };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const totals = await Withdrawal.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          byCategory: {
            $push: {
              category: '$category',
              amount: '$amount'
            }
          }
        }
      }
    ]);

    const summary = {
      total: totals[0]?.total || 0,
      byCategory: {}
    };

    if (totals[0]?.byCategory) {
      totals[0].byCategory.forEach(item => {
        summary.byCategory[item.category] = (summary.byCategory[item.category] || 0) + item.amount;
      });
    }

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

