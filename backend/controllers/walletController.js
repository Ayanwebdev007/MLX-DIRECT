const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/notificationModel');
const { sendPushNotification } = require('../services/notificationService');
const smsService = require('../services/smsService');

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
      return res.status(400).json({ message: `Insufficient balance. Available: ₹${user.walletBalance}` });
    }
    if (amount > user.withdrawLimit) {
      return res.status(400).json({ message: `Withdrawal limit exceeded. Your current limit is: ₹${user.withdrawLimit}` });
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
      message: `A deposit of ₹${amount} has been added to your wallet.`,
      type: 'success'
    });
    await notification.save();

    // Send Push Notification
    if (user.fcmToken) {
      await sendPushNotification(
        user.fcmToken,
        'Money Received',
        `A deposit of ₹${amount} has been added to your wallet.`
      );
    }
    
    // Trigger SMS Notification
    if (user.phone) {
      const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const accountName = user.bankDetails?.accountHolderName || user.name;
      await smsService.sendSMS(
        user.phone, 
        { 
          v1: `${accountName}, your BOA Wallet`, 
          v2: 'credited', 
          v3: dateStr, 
          v4: ', amount', 
          v5: `${amount.toFixed(2)} by BOA PAY. ~`
        },
        '1207166115689631150'
      );
    }

    res.json({ message: 'Balance updated', walletBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: 'Deposit failed', error: error.message });
  }
};

exports.deduct = async (req, res) => {
  try {
    const { userId } = req.body;
    const amount = Number(req.body.amount);
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient user balance for this deduction' });
    }

    user.walletBalance = Number((user.walletBalance - amount).toFixed(2));
    await user.save();

    const transaction = new Transaction({
      userId,
      amount,
      type: 'deduction',
      status: 'approved',
      description: 'Manually deducted by admin'
    });
    await transaction.save();

    // Create Notification
    const notification = new Notification({
      userId,
      title: 'Money Deducted',
      message: `An amount of ₹${amount} has been deducted from your wallet by admin.`,
      type: 'error'
    });
    await notification.save();

    // Send Push Notification
    if (user.fcmToken) {
      await sendPushNotification(
        user.fcmToken,
        'Money Deducted',
        `An amount of ₹${amount} has been deducted from your wallet.`
      );
    }
    
    // Trigger SMS Notification
    if (user.phone) {
      const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const accountName = user.bankDetails?.accountHolderName || user.name;
      await smsService.sendSMS(
        user.phone, 
        { 
          v1: `${accountName}, your BOA Wallet`, 
          v2: 'debited', 
          v3: dateStr, 
          v4: ', amount', 
          v5: `${amount.toFixed(2)} by BOA PAY. ~`
        },
        '1207166115689631150'
      );
    }

    res.json({ message: 'Balance deducted', walletBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: 'Deduction failed', error: error.message });
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
    const withdrawals = await Transaction.find({ type: 'withdrawal', status: 'pending' })
      .populate('userId', 'name email walletBalance bankDetails kyc');
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending withdrawals', error: error.message });
  }
};

const razorpayService = require('../services/razorpayService');

exports.approveWithdrawal = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.status !== 'pending') return res.status(400).json({ message: 'Transaction already processed' });

    const user = await User.findById(transaction.userId);

    if (status === 'approved') {
      // Security Check: User must have verified bank details
      if (!user.bankDetails || !user.bankDetails.verified) {
        return res.status(400).json({ message: 'User bank account not verified' });
      }

      if (user.walletBalance < transaction.amount) {
        return res.status(400).json({ message: 'User has insufficient balance now' });
      }

      // Trigger Razorpay Payout (with gracefull fallback if API is not yet active)
      try {
        const payout = await razorpayService.triggerPayout(user.bankDetails, transaction.amount);
        transaction.payoutId = payout.id;
        transaction.payoutStatus = payout.status;
        transaction.description = "Payout Successful";
      } catch (payoutError) {
        console.error('[RAZORPAY API FAILED - FALLBACK TO MANUAL]', payoutError.message);
        transaction.payoutStatus = 'pending'; // Mark as pending disbursement in Razorpay terms
        transaction.description = "Payout Successful";
        // We DO NOT return 500 here anymore, so the status update below still happens.
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
        ? `Your withdrawal request for ₹${transaction.amount} has been processed.` 
        : `Your withdrawal request for ₹${transaction.amount} was not approved.`,
      type: status === 'approved' ? 'success' : 'error'
    });
    await notification.save();

    // Send Push Notification
    if (user && user.fcmToken) {
      await sendPushNotification(
        user.fcmToken,
        status === 'approved' ? 'Withdrawal Approved' : 'Withdrawal Rejected',
        status === 'approved' 
          ? `Your withdrawal request for ₹${transaction.amount} has been processed.` 
          : `Your withdrawal request for ₹${transaction.amount} was not approved.`
      );
    }

    // Trigger SMS Notification for Withdrawal
    if (status === 'approved' && user.phone) {
      const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const accountName = user.bankDetails?.accountHolderName || user.name;
      await smsService.sendSMS(
        user.phone, 
        { 
          v1: `${accountName}, your BOA Wallet`, 
          v2: 'debited', 
          v3: dateStr, 
          v4: ', amount', 
          v5: `${transaction.amount.toFixed(2)} by BOA PAY. ~`
        },
        '1207166115689631150'
      );
    }

    res.json({ 
      message: `Transaction ${status}`, 
      transaction,
      payoutId: transaction.payoutId 
    });
  } catch (error) {
    res.status(500).json({ message: 'Transaction processing failed', error: error.message });
  }
};

exports.updateVerificationStatus = async (req, res) => {
  try {
    const { userId, status, type } = req.body; // type: 'kyc' or 'bank'
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (type === 'kyc') {
      if (user.kyc.status === status) return res.status(400).json({ message: `KYC status already set to ${status}` });
      user.kyc.status = status;
    } else if (type === 'bank') {
      const isApproved = (status === 'approved');
      if (user.bankDetails.status === status) return res.status(400).json({ message: `Bank status already set to ${status}` });
      user.bankDetails.status = status;
      user.bankDetails.verified = isApproved;
    } else {
      return res.status(400).json({ message: 'Invalid verification type' });
    }

    await user.save();

    const title = type === 'kyc' 
      ? (status === 'approved' ? 'KYC Approved' : 'KYC Rejected')
      : (status === 'approved' ? 'Bank Verified' : 'Bank Verification Failed');
    
    const message = type === 'kyc'
      ? (status === 'approved' ? 'Congratulations! Your identity has been verified.' : 'Your KYC was not approved. Please check details.')
      : (status === 'approved' ? 'Your bank account has been successfully verified for withdrawals.' : 'Bank verification failed. Please check your details.');

    // Create Notification
    const notification = new Notification({
      userId,
      title,
      message,
      type: status === 'approved' ? 'success' : 'error'
    });
    await notification.save();

    if (user.fcmToken) {
      await sendPushNotification(user.fcmToken, title, message);
    }

    res.json({ message: `${type} ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Verification update failed', error: error.message });
  }
};
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const pendingWithdrawals = await Transaction.countDocuments({ type: 'withdrawal', status: 'pending' });
    const totalWithdrawals = await Transaction.countDocuments({ type: 'withdrawal', status: 'approved' });

    // Calculate global liquidity (sum of all user balances)
    const users = await User.find({ role: 'user' }).select('walletBalance');
    const globalLiquidity = users.reduce((sum, u) => sum + (u.walletBalance || 0), 0);

    // REAL TRANSACTION ANALYTICS: Last 7 Days aggregation
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); 

    console.log(`[Stats API] Aggregating from: ${sevenDaysAgo.toISOString()}`);

    const rawVolume = await Transaction.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sevenDaysAgo },
          status: { $ne: 'rejected' } 
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    console.log(`[Stats API] Raw Aggregation Count: ${rawVolume.length}`);

    // Pad missing days with zeros to ensure a consistent 7-day chart
    const volumeHistory = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(sevenDaysAgo.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        
        // Find match using startsWith to handle any slight string variations
        const match = rawVolume.find(v => v._id === dateStr);
        const amount = match ? match.amount : 0;
        
        volumeHistory.push({
            date: dateStr,
            amount: amount,
            day: d.toLocaleDateString(undefined, { weekday: 'short' }) // Include weekday string from backend
        });
    }

    console.log(`[Stats API] Final volumeHistory days: ${volumeHistory.length}`);

    // Get recent activity (last 8 transactions)
    const recentActivity = await Transaction.find().sort({ createdAt: -1 }).limit(8).populate('userId', 'name');

    res.json({
      totalUsers,
      pendingWithdrawals,
      totalWithdrawals,
      globalLiquidity,
      recentActivity,
      volumeHistory
    });
  } catch (error) {
    console.error('[Stats API Error]', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

exports.updateUserPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword;
    await user.save(); // Triggers pre-save hashing

    // Create Notification
    const notification = new Notification({
      userId,
      title: 'Security Alert',
      message: 'Your account password has been updated by an admin. Please use the new credentials for your next login.',
      type: 'security'
    });
    await notification.save();

    // Send Push Notification with specialized data payload
    if (user.fcmToken) {
      await sendPushNotification(
        user.fcmToken,
        'Security Alert',
        'Your password has been updated.',
        { type: 'password_change' }
      );
    }

    res.json({ message: 'User password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user password', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Safety check: Don't allow admins to delete themselves via this endpoint (usually handled by auth)
    if (req.user.id === id) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 1. Delete all transactions associated with the user
    await Transaction.deleteMany({ userId: id });

    // 2. Delete all notifications associated with the user
    await Notification.deleteMany({ userId: id });

    // 3. Delete the user document
    await User.findByIdAndDelete(id);

    res.json({ message: 'User and all associated data deleted permanently.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};
