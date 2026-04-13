const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://kundurik987_db_user:ctNiETpiyAnsLjK4@cluster0.p2cwdjy.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    // Find users where phone is missing or empty
    const users = await User.find({ $or: [{ phone: { $exists: false } }, { phone: "" }, { phone: null }] });
    
    console.log(`Found ${users.length} users missing phone numbers.`);
    
    for (const user of users) {
      user.phone = "9999999999"; // Dummy 10-digit number
      await user.save();
      console.log(`Updated user: ${user.email}`);
    }
    
    console.log('Migration complete.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
