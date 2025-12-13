const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'faisal-center-secret-key-2024', {
    expiresIn: '7d'
  });
};

const ensureDefaultUsers = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users found, creating default users...');
      const users = [
        {
          username: 'admin',
          password: 'admin123',
          role: 'admin',
          name: 'System Administrator',
          email: 'admin@faisalcenter.com',
          isActive: true
        },
        {
          username: 'teacher',
          password: 'teacher123',
          role: 'teacher',
          name: 'Default Teacher',
          email: 'teacher@faisalcenter.com',
          isActive: true
        },
        {
          username: 'accountant',
          password: 'accountant123',
          role: 'accountant',
          name: 'Default Accountant',
          email: 'accountant@faisalcenter.com',
          isActive: true
        }
      ];

      for (const userData of users) {
        const user = new User(userData);
        await user.save();
        console.log(`✓ Created default user: ${userData.username}`);
      }
    }
  } catch (error) {
    console.error('Error ensuring default users:', error.message);
  }
};

router.post('/login', async (req, res) => {
  try {
    await ensureDefaultUsers();

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log(`Login attempt failed: User '${username}' not found`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      console.log(`Login attempt failed: User '${username}' is inactive`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`Login attempt failed: Invalid password for user '${username}'`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    console.log(`Login successful: User '${username}' (${user.role})`);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

router.post('/seed', async (req, res) => {
  try {
    const users = [
      {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'System Administrator',
        email: 'admin@faisalcenter.com',
        isActive: true
      },
      {
        username: 'teacher',
        password: 'teacher123',
        role: 'teacher',
        name: 'Default Teacher',
        email: 'teacher@faisalcenter.com',
        isActive: true
      },
      {
        username: 'accountant',
        password: 'accountant123',
        role: 'accountant',
        name: 'Default Accountant',
        email: 'accountant@faisalcenter.com',
        isActive: true
      }
    ];

    const created = [];
    const existing = [];

    for (const userData of users) {
      const existingUser = await User.findOne({ username: userData.username });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        created.push(userData.username);
      } else {
        existing.push(userData.username);
      }
    }

    res.json({
      message: 'Seed completed',
      created,
      existing
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ 
      message: 'Seed failed', 
      error: error.message 
    });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

