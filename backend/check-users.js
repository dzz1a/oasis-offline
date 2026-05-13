require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find();
    console.log(`Found ${users.length} users:`);
    
    for (const user of users) {
      console.log(`\nUser: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`ID: ${user._id}`);
      console.log(`Password (hashed): ${user.password}`);
      
      const testPasswords = ['123456', '1234567', 'password', '12345678'];
      for (const pwd of testPasswords) {
        const match = await bcrypt.compare(pwd, user.password);
        if (match) {
          console.log(`✓ Password match found: ${pwd}`);
        }
      }
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkUsers();