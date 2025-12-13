const express = require('express');
const Notification = require('../models/Notification');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const query = {
      $or: [
        { recipientType: 'all' },
        { recipientType: req.user.role },
        { recipients: req.user._id }
      ]
    };

    const notifications = await Notification.find(query)
      .populate('createdBy', 'name username')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/unread', auth, async (req, res) => {
  try {
    const query = {
      $or: [
        { recipientType: 'all' },
        { recipientType: req.user.role },
        { recipients: req.user._id }
      ],
      isRead: false
    };

    const count = await Notification.countDocuments(query);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const notification = new Notification({
      ...req.body,
      createdBy: req.user._id
    });
    await notification.save();
    await notification.populate('createdBy', 'name username');
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/read-all', auth, async (req, res) => {
  try {
    const query = {
      $or: [
        { recipientType: 'all' },
        { recipientType: req.user.role },
        { recipients: req.user._id }
      ],
      isRead: false
    };

    await Notification.updateMany(query, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

