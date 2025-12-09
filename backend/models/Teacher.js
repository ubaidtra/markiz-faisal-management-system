const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teacherId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  address: {
    type: String
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  qualification: {
    type: String
  },
  specialization: {
    type: String
  },
  hireDate: {
    type: Date,
    default: Date.now
  },
  salary: {
    type: Number
  },
  classes: [{
    type: String
  }],
  schedule: {
    type: Map,
    of: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  photo: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);

