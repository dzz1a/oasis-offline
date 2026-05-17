require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const newPassword = '123456';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result1 = await User.findByIdAndUpdate(
      '6a03d8857cf929e80dc423da',
      { password: hashedPassword },
      { new: true }
    );
    console.log(`✓ Updated user: ${result1.username}`);

    const result2 = await User.findByIdAndUpdate(
      '6a03dc307cf929e80dc423db',
      { password: hashedPassword },
      { new: true }
    );
    console.log(`✓ Updated user: ${result2.username}`);

    console.log(`\n✅ Both users' passwords have been reset to: ${newPassword}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

resetPassword();