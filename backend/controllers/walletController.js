const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/notificationModel');
const { sendPushNotification } = require('../services/notificationService');

// User operations
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ walletBalance: user.walletBalance, withdrawLimit: user.withdrawLimit });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching balance', error: error.message });
  }
};

exports.requestWithdrawal = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid withdrawal amount' });
    }

    const user = await User.findById(req.user.id);
    if (amount > user.walletBalance) {
      return res.status(400).json({ message: `Insufficient balance. Available: $${user.walletBalance}` });
    }
    if (amount > user.withdrawLimit) {
      return res.status(400).json({ message: `Withdrawal limit exceeded. Your current limit is: $${user.withdrawLimit}` });
    }

    const transaction = new Transaction({
      userId: user._id,
      amount,
      type: 'withdrawal',
      status: 'pending'
    });
    await transaction.save();

    res.status(201).json({ message: 'Withdrawal request submitted', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Withdrawal request failed', error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

// Admin operations
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.deposit = async (req, res) => {
  try {
    const { userId } = req.body;
    const amount = Number(req.body.amount);
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.walletBalance = Number((user.walletBalance + amount).toFixed(2));
    await user.save();

    const transaction = new Transaction({
      userId,
      amount,
      type: 'deposit',
      status: 'approved',
      description: 'Manually added by admin'
    });
    await transaction.save();

    // Create Notification
    const notification = new Notification({
      userId,
      title: 'Money Received',
      message: `A deposit of $${amount} has been added to your wallet.`,
      type: 'success'
    });
    await notification.save();

    // Send Push Notification
    if (user.fcmToken) {
      await sendPushNotification(
        user.fcmToken,
        'Money Received',
        `A deposit of $${amount} has been added to your wallet.`
      );
    }

    res.json({ message: 'Balance updated', walletBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: 'Deposit failed', error: error.message });
  }
};

exports.setWithdrawLimit = async (req, res) => {
  try {
    const { userId } = req.body;
    const limit = Number(req.body.limit);

    if (isNaN(limit) || limit < 0) {
      return res.status(400).json({ message: 'Invalid withdrawal limit' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.withdrawLimit = limit;
    await user.save();

    res.json({ message: 'Withdrawal limit updated', withdrawLimit: user.withdrawLimit });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update limit', error: error.message });
  }
};

exports.getPendingWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Transaction.find({ type: 'withdrawal', status: 'pending' }).populate('userId', 'name email');
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending withdrawals', error: error.message });
  }
};

exports.approveWithdrawal = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.status !== 'pending') return res.status(400).json({ message: 'Transaction already processed' });

    if (status === 'approved') {
      const user = await User.findById(transaction.userId);
      if (user.walletBalance < transaction.amount) {
        return res.status(400).json({ message: 'User has insufficient balance now' });
      }
      user.walletBalance = Number((user.walletBalance - transaction.amount).toFixed(2));
      await user.save();
    }

    transaction.status = status;
    await transaction.save();

    // Create Notification
    const notification = new Notification({
      userId: transaction.userId,
      title: status === 'approved' ? 'Withdrawal Approved' : 'Withdrawal Rejected',
      message: status === 'approved' 
        ? `Your withdrawal request for $${transaction.amount} has been processed.` 
        : `Your withdrawal request for $${transaction.amount} was not approved.`,
      type: status === 'approved' ? 'success' : 'error'
    });
    await notification.save();

    // Send Push Notification
    const recipient = await User.findById(transaction.userId);
    if (recipient && recipient.fcmToken) {
      await sendPushNotification(
        recipient.fcmToken,
        status === 'approved' ? 'Withdrawal Approved' : 'Withdrawal Rejected',
        status === 'approved' 
          ? `Your withdrawal request for $${transaction.amount} has been processed.` 
          : `Your withdrawal request for $${transaction.amount} was not approved.`
      );
    }

    res.json({ message: `Transaction ${status}`, transaction });
  } catch (error) {
    res.status(500).json({ message: 'Transaction processing failed', error: error.message });
  }
};
