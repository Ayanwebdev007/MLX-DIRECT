const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  withdrawLimit: {
    type: Number,
    default: 0,
  },
  fcmToken: {
    type: String,
    default: null,
  },
  kyc: {
    status: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
    pan: { type: String, default: '' },
    aadhar: { type: String, default: '' }
  },
  bankDetails: {
    accountHolderName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    bankName: { type: String, default: '' },
    verified: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
