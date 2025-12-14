const express = require('express');
const SchoolFeeSettings = require('../models/SchoolFeeSettings');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const settings = await SchoolFeeSettings.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/', auth, authorize('admin'), async (req, res) => {
  try {
    const { tuitionFee, registrationFee, otherFee } = req.body;

    if (tuitionFee === undefined || registrationFee === undefined || otherFee === undefined) {
      return res.status(400).json({ message: 'All fee amounts are required' });
    }

    if (tuitionFee < 0 || registrationFee < 0 || otherFee < 0) {
      return res.status(400).json({ message: 'Fee amounts cannot be negative' });
    }

    let settings = await SchoolFeeSettings.findOne();
    
    if (!settings) {
      settings = new SchoolFeeSettings({
        tuitionFee,
        registrationFee,
        otherFee,
        updatedBy: req.user._id
      });
    } else {
      settings.tuitionFee = tuitionFee;
      settings.registrationFee = registrationFee;
      settings.otherFee = otherFee;
      settings.updatedBy = req.user._id;
    }

    await settings.save();
    await settings.populate('updatedBy', 'name username');
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
