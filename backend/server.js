const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running. Use /api/test for the test endpoint.');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log(`New Contact Form Submission:`, { name, email, subject, message });
  
  // In a real production scenario, you would send an email here using Nodemailer
  res.status(200).json({ message: 'Success' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
