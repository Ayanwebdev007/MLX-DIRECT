const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  description: {
    type: String,
  },
  payoutId: {
    type: String,
    default: null
  },
  payoutStatus: {
    type: String,
    enum: ['none', 'pending', 'processed', 'reversed', 'failed'],
    default: 'none'
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
