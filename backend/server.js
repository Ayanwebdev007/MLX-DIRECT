const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const { seedAdmin } = require('./controllers/authController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[BACKEND LOG] ${req.method} ${req.url} | Status: ${res.statusCode} | Origin: ${req.get('origin')} | ${duration}ms`);
  });
  next();
});

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5005',
  'http://localhost:8000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5005',
  'http://127.0.0.1:8000',
  'http://192.168.29.60:5173',
  'http://192.168.1.1:5173',
  'http://192.168.1.2:5173',
  'http://192.168.1.3:5173',
  'http://192.168.1.4:5173',
  'http://192.168.1.5:5173',
  'http://192.168.1.6:5173',
  'http://192.168.1.7:5173',
  'http://192.168.1.8:5173',
  'http://192.168.1.9:5173',
  'http://192.168.1.10:5173',
  'http://localhost:5005',
  'http://192.168.29.60:5005',
  'https://mlxdirect.com',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  process.env.MOBILE_WEB_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedAdmin(); // Seed admin user if it doesn't exist
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'MLX DIRECT Backend is running.' });
});

// Final JSON Error Handler - Prevents HTML Responses
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
