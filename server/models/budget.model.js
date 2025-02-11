const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  period: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  startDate: Date,
  notifications: {
    enabled: Boolean,
    threshold: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);