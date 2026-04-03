const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://kundurik987_db_user:ctNiETpiyAnsLjK4@cluster0.p2cwdjy.mongodb.net/?appName=Cluster0';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    
    console.log('--- MLX DIRECT ATLAS DISCOVERY ---');
    for (const dbInfo of dbs.databases) {
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      
      console.log(`\nDATABASE: ${dbInfo.name}`);
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        if (count > 0) {
          console.log(`  - Collection: ${col.name} | Count: ${count}`);
        }
      }
    }
  } catch (e) {
    console.error('Atlas Probe Failed:', e);
  } finally {
    await client.close();
  }
}

run();
