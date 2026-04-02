const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
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
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
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
