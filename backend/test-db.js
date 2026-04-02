require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const fs = require('fs');

async function test() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@mlxdirect.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    console.log('Searching for admin...');
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      console.log('Creating admin...');
      admin = new User({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Admin created!');
    } else {
      console.log('Admin already exists.');
    }
    process.exit(0);
  } catch (err) {
    const errorData = {
      message: err.message,
      stack: err.stack,
      errors: err.errors
    };
    fs.writeFileSync('error_details.json', JSON.stringify(errorData, null, 2));
    console.error('FAILED. See error_details.json');
    process.exit(1);
  }
}

test();
