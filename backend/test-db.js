require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    const users = await mongoose.connection.db.collection('users').find().toArray();
    console.log(`Found ${users.length} users:`);
    users.forEach(u => console.log(`- ${u.username} (${u.email})`));
    
    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testConnection();