const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://kundurik987_db_user:ctNiETpiyAnsLjK4@cluster0.p2cwdjy.mongodb.net/?appName=Cluster0';
const client = new MongoClient(uri);

async function scan() {
  try {
    await client.connect();
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    
    console.log('--- ATLAS PRODUCTION DATA SCAN ---');
    for (const dbInfo of dbs.databases) {
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      
      console.log(`\nDATABASE: ${dbInfo.name}`);
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        const first = await db.collection(col.name).find({}).sort({_id: 1}).limit(1).toArray();
        console.log(`  - ${col.name}: ${count} records (Earliest: ${first[0]?._id?.getTimestamp() || 'N/A'})`);
      }
    }
  } catch (e) {
    console.error('Atlas Scan Failed:', e);
  } finally {
    await client.close();
  }
}

scan();
