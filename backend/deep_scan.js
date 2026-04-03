const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://kundurik987_db_user:ctNiETpiyAnsLjK4@cluster0.p2cwdjy.mongodb.net/?appName=Cluster0';
const client = new MongoClient(uri);

async function scan() {
  try {
    await client.connect();
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    
    console.log('--- MLX DIRECT DEEP ATLAS DISCOVERY ---');
    for (const dbInfo of dbs.databases) {
      console.log(`\nDATABASE: ${dbInfo.name}`);
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        if (count > 0) {
          const sample = await db.collection(col.name).findOne({});
          console.log(`  - [${col.name}] Count: ${count} | Sample Key: ${Object.keys(sample).slice(0, 3).join(', ')}`);
        }
      }
    }
  } catch (e) {
    console.error('Atlas Discovery Failed:', e);
  } finally {
    await client.close();
  }
}

scan();
