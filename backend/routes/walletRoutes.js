const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const jwt = require('jsonwebtoken');

const { auth, admin } = require('../middleware/authMiddleware');

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
router.post('/admin/update-verification-status', auth, admin, walletController.updateVerificationStatus);
router.get('/admin/stats', auth, admin, walletController.getStats);
router.post('/admin/update-user-password', auth, admin, walletController.updateUserPassword);
router.delete('/admin/user/:id', auth, admin, walletController.deleteUser);

module.exports = router;
