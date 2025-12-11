const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://Abdoullahsecka:secka281986@cluster0.lxszwnk.mongodb.net/faisal-center?retryWrites=true&w=majority&appName=Cluster0');

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
      const existingUser = await User.findOne({ username: userData.username });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`Created user: ${userData.username}`);
      } else {
        console.log(`User ${userData.username} already exists`);
      }
    }

    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedUsers();

