const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const UserBadge = require('./models/UserBadge');
const Badge = require('./models/Badge');

async function checkUserBadges() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const email = 'hanhanangovo@qq.com';
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('用户不存在');
      process.exit();
    }

    console.log('用户:', user.email);

    const userBadges = await UserBadge.find({ userId: user._id }).populate('badgeId');
    console.log('\n用户已获得的徽章:');
    if (userBadges.length === 0) {
      console.log('  暂无徽章');
    } else {
      userBadges.forEach((ub, index) => {
        console.log(`  ${index + 1}. ${ub.badgeId.name} (${ub.badgeId.icon})`);
      });
    }

    console.log('\n所有徽章列表:');
    const allBadges = await Badge.find();
    allBadges.forEach((badge, index) => {
      const earned = userBadges.some(ub => ub.badgeId._id.toString() === badge._id.toString());
      console.log(`  ${index + 1}. ${badge.name} (${badge.icon}) - ${earned ? '已获得' : '未获得'}`);
    });

    process.exit();
  } catch (error) {
    console.error('查询失败:', error);
    process.exit(1);
  }
}

checkUserBadges();