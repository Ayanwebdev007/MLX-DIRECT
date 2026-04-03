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
router.post('/fcm-token', auth, authController.updateFCMToken);

module.exports = router;
