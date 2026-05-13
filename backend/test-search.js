require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testSearch() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const keyword = '太爱着急了';
    console.log(`Searching for keyword: "${keyword}"`);

    const users = await User.find({
      $or: [
        { username: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } }
      ]
    }).select('-password');

    console.log(`Found ${users.length} users:`);
    users.forEach(u => console.log(`- ${u.username} (${u.email})`));

    const keyword2 = '诙';
    console.log(`\nSearching for keyword: "${keyword2}"`);
    const users2 = await User.find({
      $or: [
        { username: { $regex: keyword2, $options: 'i' } },
        { email: { $regex: keyword2, $options: 'i' } }
      ]
    }).select('-password');

    console.log(`Found ${users2.length} users:`);
    users2.forEach(u => console.log(`- ${u.username} (${u.email})`));

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testSearch();