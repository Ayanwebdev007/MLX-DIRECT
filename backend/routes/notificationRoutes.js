const express = require('express');
const router = express.Router();
const Notification = require('../models/notificationModel');
const jwt = require('jsonwebtoken');

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

// @desc    Get all notifications for user
// @route   GET /api/notifications
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching notifications' });
  }
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
router.patch('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error marking notifications' });
  }
});

module.exports = router;
