const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only images (JPEG, JPG, PNG, WEBP) are allowed'));
  }
});

// Reuse auth middleware logic
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

const admin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Public route: Get all active banners
router.get('/', bannerController.getBanners);

// Admin routes: Manage banners
// middleware 'upload.single' handles the file upload
router.post('/admin', auth, admin, upload.single('image'), bannerController.createBanner);
router.delete('/admin/:id', auth, admin, bannerController.deleteBanner);

module.exports = router;
