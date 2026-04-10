const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const jwt = require('jsonwebtoken');

const { auth, admin } = require('../middleware/authMiddleware');

// Public route
router.post('/submit', contactController.submitMessage);

// Admin routes
router.get('/messages', auth, admin, contactController.getMessages);
router.patch('/messages/:id/read', auth, admin, contactController.markAsRead);
router.delete('/messages/:id', auth, admin, contactController.deleteMessage);

module.exports = router;
