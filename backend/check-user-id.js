const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function checkUserId() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const userId = '6a03dc307cf929e80dc423db';
    const user = await User.findById(userId);
    
    if (user) {
      console.log('用户ID:', userId);
      console.log('邮箱:', user.email);
      console.log('用户名:', user.username);
    } else {
      console.log('未找到用户');
    }

    process.exit();
  } catch (error) {
    console.error('查询失败:', error);
    process.exit(1);
  }
}

checkUserId();