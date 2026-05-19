const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const email = 'hanhanangovo@qq.com';
    const newPassword = '123456';

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('新密码哈希:', hashedPassword);
    
    const result = await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount === 1) {
      console.log('密码重置成功！');
    } else {
      console.log('用户不存在或密码未修改');
    }

    process.exit();
  } catch (error) {
    console.error('重置密码失败:', error);
    process.exit(1);
  }
}

resetPassword();