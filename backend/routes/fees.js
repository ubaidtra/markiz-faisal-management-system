const express = require('express');
const Fee = require('../models/Fee');
const SchoolFeeSettings = require('../models/SchoolFeeSettings');
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
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const fees = await Fee.find(query)
      .populate('student', 'firstName lastName studentId')
      .populate('recordedBy', 'name username')
      .sort({ createdAt: -1 });
    
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
    const feeData = {
      ...req.body,
      recordedBy: req.user._id
    };

    if (feeData.paymentMethod) {
      feeData.status = 'paid';
      feeData.paidAmount = feeData.paidAmount || feeData.amount;
      feeData.paidDate = new Date();
    }

    const fee = new Fee(feeData);
    await fee.save();
    await fee.populate('student', 'firstName lastName studentId');
    await fee.populate('recordedBy', 'name username');
    res.status(201).json(fee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/bulk', auth, authorize('admin', 'accountant'), async (req, res) => {
  try {
    const { fees } = req.body;
    
    if (!Array.isArray(fees) || fees.length === 0) {
      return res.status(400).json({ message: 'Fees array is required' });
    }

    const feeDataArray = fees.map(feeData => {
      const processedData = {
        ...feeData,
        recordedBy: req.user._id
      };

      if (processedData.paymentMethod) {
        processedData.status = 'paid';
        processedData.paidAmount = processedData.paidAmount || processedData.amount;
        processedData.paidDate = new Date();
      }

      return processedData;
    });

    const createdFees = await Fee.insertMany(feeDataArray);
    await Fee.populate(createdFees, [
      { path: 'student', select: 'firstName lastName studentId' },
      { path: 'recordedBy', select: 'name username' }
    ]);

    res.status(201).json({
      message: `Successfully created ${createdFees.length} fee record(s)`,
      count: createdFees.length,
      fees: createdFees
    });
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

    // If payment method is provided or updated, it means payment is registered and fee is paid
    if (req.body.paymentMethod) {
      req.body.status = 'paid';
      req.body.paidAmount = req.body.paidAmount || fee.amount;
      req.body.paidDate = new Date();
    } else if (req.body.paidAmount !== undefined) {
      // If paidAmount is updated without paymentMethod, handle partial payments
      fee.paidAmount = req.body.paidAmount;
      if (fee.paidAmount >= fee.amount) {
        fee.status = 'paid';
        fee.paidDate = new Date();
      } else if (fee.paidAmount > 0) {
        fee.status = 'partial';
      } else {
        fee.status = 'pending';
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
    const currentYear = new Date().getFullYear();
    const currentYearStart = new Date(currentYear, 0, 1);
    const currentYearEnd = new Date(currentYear, 11, 31);
    
    const tuitionFees = fees.filter(f => f.feeType === 'tuition');
    const currentYearTuitionFees = tuitionFees.filter(f => {
      const feeDate = new Date(f.period + '-01');
      return feeDate >= currentYearStart && feeDate <= currentYearEnd;
    });
    
    const settings = await SchoolFeeSettings.getSettings();
    const monthlyTuitionFee = settings.tuitionFee;
    const expectedYearlyTuition = monthlyTuitionFee * 12;
    
    const totalTuitionPaid = currentYearTuitionFees.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
    const totalTuitionExpected = currentYearTuitionFees.reduce((sum, f) => sum + f.amount, 0);
    const pendingYearlyTuition = expectedYearlyTuition - totalTuitionPaid;
    
    const summary = {
      totalFees: fees.reduce((sum, f) => sum + f.amount, 0),
      totalPaid: fees.reduce((sum, f) => sum + f.paidAmount, 0),
      totalPending: fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + (f.amount - f.paidAmount), 0),
      totalOverdue: fees.filter(f => f.status === 'overdue').reduce((sum, f) => sum + (f.amount - f.paidAmount), 0),
      pendingCount: fees.filter(f => f.status === 'pending').length,
      paidCount: fees.filter(f => f.status === 'paid').length,
      overdueCount: fees.filter(f => f.status === 'overdue').length,
      yearlyTuition: {
        expectedYearly: expectedYearlyTuition,
        monthlyFee: monthlyTuitionFee,
        totalPaid: totalTuitionPaid,
        totalExpected: totalTuitionExpected,
        pending: pendingYearlyTuition,
        paidMonths: currentYearTuitionFees.filter(f => f.status === 'paid').length,
        totalMonths: currentYearTuitionFees.length
      }
    };
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/yearly-summary', auth, async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);
    
    const Student = require('../models/Student');
    const feePayingStudentIds = await Student.find({ paysTuitionFee: { $ne: false } }).distinct('_id');
    
    const settings = await SchoolFeeSettings.getSettings();
    const monthlyTuitionFee = settings.tuitionFee;
    const expectedYearlyTuition = monthlyTuitionFee * 12;
    
    const allFees = await Fee.find({
      feeType: 'tuition',
      student: { $in: feePayingStudentIds },
      period: {
        $gte: `${currentYear}-01`,
        $lte: `${currentYear}-12`
      }
    }).populate('student', 'firstName lastName studentId');
    
    const studentSummary = {};
    
    allFees.forEach(fee => {
      const studentId = fee.student._id.toString();
      if (!studentSummary[studentId]) {
        studentSummary[studentId] = {
          student: {
            _id: fee.student._id,
            firstName: fee.student.firstName,
            lastName: fee.student.lastName,
            studentId: fee.student.studentId
          },
          expectedYearly: expectedYearlyTuition,
          monthlyFee: monthlyTuitionFee,
          totalPaid: 0,
          totalExpected: 0,
          paidMonths: 0,
          totalMonths: 0,
          fees: []
        };
      }
      
      studentSummary[studentId].totalPaid += fee.paidAmount || 0;
      studentSummary[studentId].totalExpected += fee.amount;
      studentSummary[studentId].totalMonths += 1;
      if (fee.status === 'paid') {
        studentSummary[studentId].paidMonths += 1;
      }
      studentSummary[studentId].fees.push(fee);
    });
    
    const summary = Object.values(studentSummary).map(s => ({
      ...s,
      pending: s.expectedYearly - s.totalPaid,
      remainingMonths: 12 - s.totalMonths
    }));
    
    res.json({
      year: currentYear,
      monthlyTuitionFee,
      expectedYearlyTuition,
      students: summary
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

