const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
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

// Middleware to verify Admin
const admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// User routes
router.get('/balance', auth, walletController.getBalance);
router.post('/withdraw-request', auth, walletController.requestWithdrawal);
router.get('/transactions', auth, walletController.getTransactions);

// Admin routes
router.get('/admin/users', auth, admin, walletController.getUsers);
router.post('/admin/deposit', auth, admin, walletController.deposit);
router.post('/admin/set-limit', auth, admin, walletController.setWithdrawLimit);
router.get('/admin/withdrawals', auth, admin, walletController.getPendingWithdrawals);
router.post('/admin/approve-withdrawal/:id', auth, admin, walletController.approveWithdrawal);

module.exports = router;
