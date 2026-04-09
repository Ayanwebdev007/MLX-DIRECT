require('dotenv').config();
const Razorpay = require('razorpay');

async function testConnection() {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    
    console.log("Attempting to connect with Key ID:", process.env.RAZORPAY_KEY_ID);
    
    // Test creating a contact
    const contact = await rzp.contacts.create({
      name: 'Test Verification',
      type: 'customer',
      reference_id: 'test_' + Date.now()
    });
    
    console.log("✅ SUCCESS! Connected to Live Razorpay Account.");
    console.log("✅ Contact created with ID:", contact.id);
  } catch (error) {
    console.error("❌ FAILED to connect. Error details:", error);
  }
}

testConnection();
