const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, admin } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for memory storage with a 10MB limit
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * Administrative Routes
 * All routes here are protected and require admin privileges
 */

// POST /api/admin/send-email
router.post('/send-email', auth, admin, upload.single('attachment'), adminController.sendEmail);

// GET /api/admin/sent-emails
router.get('/sent-emails', auth, admin, adminController.getSentEmails);

module.exports = router;
