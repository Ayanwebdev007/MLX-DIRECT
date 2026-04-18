const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);
router.post('/fcm-token', auth, authController.updateFCMToken);
router.post('/upload-kyc-doc', auth, authController.uploadMiddleware, authController.uploadKycDoc);
router.post('/update-kyc', auth, authController.updateKYC);
router.post('/update-bank', auth, authController.updateBankDetails);
router.post('/update-password', auth, authController.updatePassword);

module.exports = router;
