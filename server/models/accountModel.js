const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    accountType: {
      type: String,
      enum: ['Savings', 'Checking', 'Business', 'Student'],
      required: true
    },
    balance: {
      type: Number,
      default: 0
    },
    accountNumber: {
      type: String,
      unique: true,
      required: true
    },
    owner: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Active', 'Closed', 'Suspended'],
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Account', accountSchema);