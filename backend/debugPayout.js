require('dotenv').config();
const axios = require('axios');

async function debugPayout() {
  const authHeader = 'Basic ' + Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
  
  console.log("Using Key ID:", process.env.RAZORPAY_KEY_ID);
  
  try {
    const response = await axios.post('https://api.razorpay.com/v1/payouts', {
      account_number: '2323230045173715', // This is likely the issue in LIVE mode
      fund_account_id: 'fa_Sb2yXAgLPDq31f', // Using the ID from earlier test
      amount: 100,
      currency: 'INR',
      mode: 'IMPS',
      purpose: 'payout'
    }, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });
    console.log("Response:", response.data);
  } catch (error) {
    if (error.response) {
      console.log("Error Data:", JSON.stringify(error.response.data, null, 2));
      console.log("Status:", error.response.status);
    } else {
      console.log("Error Message:", error.message);
    }
  }
}

debugPayout();
