const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required including mobile number' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password, phone });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Seed admin user
exports.seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@mlxdirect.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = new User({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

const razorpayService = require('../services/razorpayService');

// Update Password
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || !(await user.comparePassword(oldPassword))) {
      return res.status(401).json({ message: 'Current password incorrect' });
    }

    user.password = newPassword;
    await user.save(); // This triggers the pre-save hashing hook

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Password update failed', error: error.message });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

// Update FCM Token
exports.updateFCMToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    await User.findByIdAndUpdate(req.user.id, { fcmToken });
    res.json({ message: 'FCM Token updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update FCM Token', error: error.message });
  }
};

// Update KYC Details
exports.updateKYC = async (req, res) => {
  try {
    const { pan, aadhar } = req.body;
    
    // Basic format validation (Regex)
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    const aadharRegex = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;

    if (!panRegex.test(pan)) return res.status(400).json({ message: 'Invalid PAN format' });
    if (!aadharRegex.test(aadhar)) return res.status(400).json({ message: 'Invalid Aadhar format' });

    await User.findByIdAndUpdate(req.user.id, {
      kyc: { status: 'pending', pan, aadhar } // Submitted for manual approval
    });
    
    res.json({ message: 'Identity documents submitted for manual verification' });
  } catch (error) {
    res.status(500).json({ message: 'KYC submission failed', error: error.message });
  }
};

// Update Bank Details (with Mock Penny Drop)
exports.updateBankDetails = async (req, res) => {
  try {
    const { accountHolderName, accountNumber, ifscCode, bankName } = req.body;

    if (!accountNumber || !ifscCode) {
      return res.status(400).json({ message: 'Account number and IFSC are required' });
    }

    // Trigger Mock Verification (Penny Drop)
    const verification = await razorpayService.verifyBankAccount({
      accountHolderName,
      accountNumber,
      ifscCode
    });

    await User.findByIdAndUpdate(req.user.id, {
      bankDetails: {
        status: 'pending',
        accountHolderName: verification.registeredName,
        accountNumber,
        ifscCode,
        bankName,
        verified: false
      }
    });
 
    res.json({ 
      message: 'Bank account details submitted for manual verification', 
      verifiedName: verification.registeredName 
    });
  } catch (error) {
    res.status(500).json({ message: 'Bank verification failed', error: error.message });
  }
};
