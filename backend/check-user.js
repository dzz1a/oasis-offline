const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const users = await User.find({}, 'email username');
    console.log('数据库中的用户:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.username})`);
    });

    const email = 'hanhanangovo@qq.com';
    const user = await User.findOne({ email });
    if (user) {
      console.log(`\n找到用户: ${user.email}`);
      console.log('密码已加密:', !!user.password);
    } else {
      console.log(`\n未找到用户: ${email}`);
    }

    process.exit();
  } catch (error) {
    console.error('查询失败:', error);
    process.exit(1);
  }
}

checkUser();