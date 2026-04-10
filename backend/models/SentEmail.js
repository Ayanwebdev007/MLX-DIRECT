const mongoose = require('mongoose');

const SentEmailSchema = new mongoose.Schema({
  to: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  from: {
    type: String,
    trim: true
  },
  senderName: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  html: {
    type: String
  },
  attachmentName: {
    type: String,
    default: null
  },
  direction: {
    type: String,
    enum: ['sent', 'received'],
    default: 'sent'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-delete records older than 180 days (6 months)
SentEmailSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 * 24 * 60 * 60 });

module.exports = mongoose.model('SentEmail', SentEmailSchema);
