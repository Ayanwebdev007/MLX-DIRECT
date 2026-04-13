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
  phone: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    }
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
    status: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
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
