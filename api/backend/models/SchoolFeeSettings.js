const mongoose = require('mongoose');

const schoolFeeSettingsSchema = new mongoose.Schema({
  tuitionFee: {
    type: Number,
    required: true,
    default: 0
  },
  registrationFee: {
    type: Number,
    required: true,
    default: 0
  },
  otherFee: {
    type: Number,
    required: true,
    default: 0
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

schoolFeeSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      tuitionFee: 0,
      registrationFee: 0,
      otherFee: 0
    });
  }
  return settings;
};

module.exports = mongoose.model('SchoolFeeSettings', schoolFeeSettingsSchema);
