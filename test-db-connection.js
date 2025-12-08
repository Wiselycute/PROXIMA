const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('Connection string:', process.env.MONGO_DB ? 'Found' : 'Not found');
    
    const conn = await mongoose.connect(process.env.MONGO_DB, {
      dbName: 'taskmanager',
      serverSelectionTimeoutMS: 5000
    });

    console.log('✅ MongoDB Connected!');
    
    // List all databases
    const adminDb = conn.connection.db.admin();
    const dbs = await adminDb.listDatabases();
    console.log('Available databases:');
    dbs.databases.forEach(db => console.log(`- ${db.name}`));

    // List collections in taskmanager database
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('\nCollections in taskmanager:');
    collections.forEach(coll => console.log(`- ${coll.name}`));

    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
}

testConnection();
