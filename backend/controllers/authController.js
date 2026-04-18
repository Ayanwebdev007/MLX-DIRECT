const User = require('../models/User');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { uploadToCloudinary } = require('../services/cloudinaryService');

// Multer Config for temporary storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/temp';
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('[MULTER] Created directory:', uploadDir);
      }
      cb(null, uploadDir);
    } catch (err) {
      console.error('[MULTER] Directory creation failed:', err);
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg, .jpeg and .pdf formats allowed!'));
  }
}).single('document');

exports.uploadMiddleware = upload;

// Controller to handle the actual upload
exports.uploadKycDoc = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(req.file.path, 'kyc_documents');
    
    // Remove local file after upload
    fs.unlinkSync(req.file.path);

    res.json({ 
      message: 'File uploaded successfully', 
      url: result.secure_url 
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Upload to Cloudinary failed', error: error.message });
  }
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required including mobile number' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: 'Phone number already exists' });
    }

    const user = new User({ name, email, password, phone });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } 
    });
  } catch (error) {
    console.error('[REGISTRATION ERROR]', error);
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
    } else if (adminPassword !== (process.env.ADMIN_PASSWORD || 'admin123')) {
      // If admin exists but password in .env has changed, update it
      // Note: We compare with the raw password from .env, but usually you'd check if they are already in sync.
      // Since we just changed .env, we can just update it.
      admin.password = adminPassword;
      await admin.save();
      console.log('Admin password updated successfully');
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
    const { pan, aadhar, documentUrl } = req.body;
    
    // Basic format validation (Regex)
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    const aadharRegex = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;

    if (!panRegex.test(pan)) return res.status(400).json({ message: 'Invalid PAN format' });
    if (!aadharRegex.test(aadhar)) return res.status(400).json({ message: 'Invalid Aadhar format' });
    if (!documentUrl) return res.status(400).json({ message: 'Document upload is required' });

    await User.findByIdAndUpdate(req.user.id, {
      kyc: { status: 'pending', pan, aadhar, documentUrl } // Submitted for manual approval
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
