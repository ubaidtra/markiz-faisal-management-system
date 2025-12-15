const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  feeType: {
    type: String,
    enum: ['tuition', 'registration', 'other'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  period: {
    type: String,
    required: function() {
      return this.feeType === 'tuition';
    }
  },
  dueDate: {
    type: Date
  },
  paidDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'partial'],
    default: 'pending'
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank-transfer', 'mobile-money', 'other']
  },
  receiptNumber: {
    type: String
  },
  notes: {
    type: String
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Fee', feeSchema);

