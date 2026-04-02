const { MongoClient } = require('mongodb');

async function probe() {
  const localUri = 'mongodb://127.0.0.1:27017';
  const atlasUri = 'mongodb+srv://kundurik987_db_user:ctNiETpiyAnsLjK4@cluster0.p2cwdjy.mongodb.net/?appName=Cluster0';

  console.log('--- SCANNING LOCAL DATABASES ---');
  await scan(localUri);

  console.log('\n--- SCANNING ATLAS DATABASES ---');
  await scan(atlasUri);
}

async function scan(uri) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    
    for (const dbInfo of dbs.databases) {
      if (['admin', 'config', 'local'].includes(dbInfo.name)) continue;
      
      console.log(`\nDATABASE: ${dbInfo.name}`);
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        const sample = await db.collection(col.name).find({}).limit(1).toArray();
        console.log(`  - ${col.name}: ${count} records (Sample Email: ${sample[0]?.email || 'N/A'})`);
      }
    }
  } catch (e) {
    console.error(`  [!] Connection failed for ${uri.substring(0, 20)}...`);
  } finally {
    await client.close();
  }
}

probe();
