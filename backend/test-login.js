const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const email = 'hanhanangovo@qq.com';
    const password = '123456';

    const user = await User.findOne({ email });
    if (!user) {
      console.log('用户不存在');
      process.exit();
    }

    console.log('用户找到:', user.email);
    console.log('密码哈希:', user.password);
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('密码匹配:', isMatch);

    const isMatch2 = await user.comparePassword(password);
    console.log('使用comparePassword方法:', isMatch2);

    process.exit();
  } catch (error) {
    console.error('测试失败:', error);
    process.exit(1);
  }
}

testLogin();