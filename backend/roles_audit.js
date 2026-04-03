const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://kundurik987_db_user:ctNiETpiyAnsLjK4@cluster0.p2cwdjy.mongodb.net/test?appName=Cluster0';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('test');
    const users = await db.collection('users').find({}).toArray();
    
    console.log('--- MLX DIRECT USER ROLE AUDIT ---');
    console.log(`TOTAL USERS: ${users.length}`);
    
    users.forEach(u => {
      console.log(`  - Name: ${u.name} | Email: ${u.email} | Role: ${u.role}`);
    });
    
  } catch (e) {
    console.error('Atlas Audit Failed:', e);
  } finally {
    await client.close();
  }
}

run();
