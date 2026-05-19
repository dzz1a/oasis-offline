const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const UserBadge = require('./models/UserBadge');
const Badge = require('./models/Badge');

async function testBadgeAPI() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const email = 'hanhanangovo@qq.com';
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('用户不存在');
      process.exit();
    }

    const userId = user._id.toString();
    console.log('用户ID:', userId);

    const userBadges = await UserBadge.find({ userId }).populate('badgeId');
    const earnedBadgeIds = userBadges.map(ub => ub.badgeId._id.toString());
    
    const allBadges = await Badge.find({ isActive: true });

    const badgesWithStatus = await Promise.all(allBadges.map(async (badge) => {
      const earned = earnedBadgeIds.includes(badge._id.toString());
      
      return {
        ...badge.toObject(),
        earned,
        earnedAt: null,
        progress: earned ? 100 : 0,
        current: earned ? badge.requirement.count : 0,
        target: badge.requirement.count
      };
    }));

    const groupedBadges = {
      health: badgesWithStatus.filter(b => b.category === 'health'),
      energy: badgesWithStatus.filter(b => b.category === 'energy'),
      emotion: badgesWithStatus.filter(b => b.category === 'emotion'),
      streak: badgesWithStatus.filter(b => b.category === 'streak')
    };

    console.log('\nAPI返回的数据结构:');
    console.log('success:', true);
    console.log('earnedCount:', userBadges.length);
    console.log('totalCount:', allBadges.length);
    
    console.log('\n按类别分组的徽章:');
    Object.keys(groupedBadges).forEach(category => {
      console.log(`\n${category} (${groupedBadges[category].length}个):`);
      groupedBadges[category].forEach(badge => {
        console.log(`  - ${badge.name}: earned=${badge.earned}`);
      });
    });

    // 模拟前端提取已获得徽章
    const earnedBadges = [];
    Object.values(groupedBadges).forEach((category) => {
      category.forEach((badge) => {
        if (badge.earned) {
          earnedBadges.push(badge);
        }
      });
    });
    
    console.log(`\n提取的已获得徽章数量: ${earnedBadges.length}`);
    earnedBadges.forEach(badge => {
      console.log(`  - ${badge.name}`);
    });

    process.exit();
  } catch (error) {
    console.error('测试失败:', error);
    process.exit(1);
  }
}

testBadgeAPI();