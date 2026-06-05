const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');
const User = require('../models/User');
const UserTask = require('../models/UserTask');
const EmotionRecord = require('../models/EmotionRecord');
const Task = require('../models/Task');

const defaultBadges = [
  {
    code: 'meal_10',
    name: '按时吃饭',
    icon: '🥗',
    description: '完成10次吃饭任务',
    category: 'health',
    requirement: { type: 'task_count', count: 10, taskCode: 'meal' }
  },
  {
    code: 'exercise_5',
    name: '运动达人',
    icon: '🏃',
    description: '完成5次运动任务',
    category: 'health',
    requirement: { type: 'task_count', count: 5, taskCode: 'exercise' }
  },
  {
    code: 'sleep_7',
    name: '早睡早起',
    icon: '😴',
    description: '完成7天按时睡觉',
    category: 'health',
    requirement: { type: 'task_count', count: 7, taskCode: 'sleep' }
  },
  {
    code: 'meditation_10',
    name: '冥想大师',
    icon: '🧘',
    description: '完成10次冥想',
    category: 'health',
    requirement: { type: 'task_count', count: 10, taskCode: 'meditation' }
  },
  {
    code: 'reading_5',
    name: '阅读爱好者',
    icon: '📚',
    description: '完成5次阅读',
    category: 'health',
    requirement: { type: 'task_count', count: 5, taskCode: 'reading' }
  },
  {
    code: 'water_20',
    name: '喝水达人',
    icon: '💧',
    description: '完成20次喝水',
    category: 'health',
    requirement: { type: 'task_count', count: 20, taskCode: 'water' }
  },
  {
    code: 'social_10',
    name: '社交达人',
    icon: '💝',
    description: '完成10次社交任务',
    category: 'health',
    requirement: { type: 'task_count', count: 10, taskCode: 'social' }
  },
  {
    code: 'breathing_10',
    name: '呼吸练习',
    icon: '🌬️',
    description: '完成10次深呼吸',
    category: 'health',
    requirement: { type: 'task_count', count: 10, taskCode: 'breathing' }
  },
  {
    code: 'energy_50',
    name: '能量满满',
    icon: '⚡',
    description: '能量值达到50',
    category: 'energy',
    requirement: { type: 'energy_level', count: 50 }
  },
  {
    code: 'energy_100',
    name: '超级能量',
    icon: '🔋',
    description: '能量值达到100',
    category: 'energy',
    requirement: { type: 'energy_level', count: 100 }
  },
  {
    code: 'energy_500',
    name: '能量王者',
    icon: '🌟',
    description: '累计获得500能量',
    category: 'energy',
    requirement: { type: 'total_energy', count: 500 }
  },
  {
    code: 'emotion_10',
    name: '情绪观察者',
    icon: '😊',
    description: '记录10次情绪',
    category: 'emotion',
    requirement: { type: 'emotion_count', count: 10 }
  },
  {
    code: 'emotion_30',
    name: '情绪达人',
    icon: '🌈',
    description: '记录30次情绪',
    category: 'emotion',
    requirement: { type: 'emotion_count', count: 30 }
  },
  {
    code: 'emotion_happy_7',
    name: '心态积极',
    icon: '🎭',
    description: '连续7天记录开心',
    category: 'emotion',
    requirement: { type: 'happy_streak', count: 7 }
  },
  {
    code: 'emotion_14',
    name: '心灵记录者',
    icon: '✍️',
    description: '连续14天记录情绪',
    category: 'emotion',
    requirement: { type: 'emotion_streak', count: 14 }
  },
  {
    code: 'streak_3',
    name: '坚持3天',
    icon: '📅',
    description: '连续3天完成至少3个任务',
    category: 'streak',
    requirement: { type: 'task_streak', count: 3, minTasks: 3 }
  },
  {
    code: 'streak_7',
    name: '坚持7天',
    icon: '📅',
    description: '连续7天完成至少3个任务',
    category: 'streak',
    requirement: { type: 'task_streak', count: 7, minTasks: 3 }
  },
  {
    code: 'streak_30',
    name: '坚持30天',
    icon: '🏆',
    description: '连续30天完成至少3个任务',
    category: 'streak',
    requirement: { type: 'task_streak', count: 30, minTasks: 3 }
  }
];

exports.initializeBadges = async () => {
  try {
    const count = await Badge.countDocuments();
    if (count === 0) {
      await Badge.insertMany(defaultBadges);
      console.log('默认徽章已初始化');
    }
  } catch (error) {
    console.error('初始化徽章失败:', error);
  }
};

exports.getBadgeList = async (userId) => {
  try {
    const userBadges = await UserBadge.find({ userId }).populate('badgeId');
    const earnedBadgeIds = userBadges.map(ub => ub.badgeId._id.toString());
    const allBadges = await Badge.find({ isActive: true });

    const badgesWithStatus = allBadges.map(badge => {
      const earned = earnedBadgeIds.includes(badge._id.toString());
      const userBadge = userBadges.find(ub => ub.badgeId._id.toString() === badge._id.toString());
      
      return {
        ...badge.toObject(),
        earned,
        earnedAt: userBadge ? userBadge.earnedAt : null
      };
    });

    return badgesWithStatus;
  } catch (error) {
    console.error('获取徽章列表失败:', error);
    return [];
  }
};

exports.getUserBadges = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userBadges = await UserBadge.find({ userId }).populate('badgeId');
    const earnedBadgeIds = userBadges.map(ub => ub.badgeId._id.toString());
    
    const allBadges = await Badge.find({ isActive: true });
    const user = await User.findById(userId);

    const taskCodeMap = {
      'meal': ['早餐', '午餐', '晚餐'],
      'exercise': ['运动30分钟'],
      'sleep': ['按时睡觉'],
      'meditation': ['冥想10分钟'],
      'reading': ['阅读'],
      'water': ['喝水'],
      'social': ['与朋友聊天', '帮助他人', '表达感谢'],
      'breathing': ['深呼吸']
    };

    const badgesWithStatus = await Promise.all(allBadges.map(async (badge) => {
      const earned = earnedBadgeIds.includes(badge._id.toString());
      const userBadge = userBadges.find(ub => ub.badgeId._id.toString() === badge._id.toString());
      
      let progress = 0;
      let current = 0;
      let target = badge.requirement.count;

      if (badge.requirement.type === 'energy_level') {
        current = user?.energyLevel || 0;
        progress = Math.min(100, Math.round((current / target) * 100));
      }
      else if (badge.requirement.type === 'total_energy') {
        const totalEnergy = await UserTask.aggregate([
          { $match: { userId } },
          { $group: { _id: null, total: { $sum: '$energyGained' } } }
        ]);
        current = totalEnergy[0]?.total || 0;
        progress = Math.min(100, Math.round((current / target) * 100));
      }
      else if (badge.requirement.type === 'emotion_count') {
        current = await EmotionRecord.countDocuments({ userId });
        progress = Math.min(100, Math.round((current / target) * 100));
      }
      else if (badge.requirement.type === 'task_count') {
        const taskNames = taskCodeMap[badge.requirement.taskCode] || [];
        if (taskNames.length > 0) {
          const tasks = await Task.find({ name: { $in: taskNames } });
          const taskIds = tasks.map(t => t._id);
          current = await UserTask.countDocuments({
            userId,
            taskId: { $in: taskIds }
          });
        }
        progress = Math.min(100, Math.round((current / target) * 100));
      }
      else if (badge.requirement.type === 'happy_streak') {
        const emotions = await EmotionRecord.find({ userId, emotion: 'happy' })
          .sort({ createdAt: -1 })
          .limit(target);
        current = emotions.length;
        progress = Math.min(100, Math.round((current / target) * 100));
      }
      else if (badge.requirement.type === 'emotion_streak') {
        const emotions = await EmotionRecord.find({ userId })
          .sort({ createdAt: -1 });
        let streakCount = 0;
        let prevDate = null;
        for (const emotion of emotions) {
          const currentDate = new Date(emotion.createdAt);
          currentDate.setHours(0, 0, 0, 0);
          if (prevDate) {
            const expectedPrevDate = new Date(currentDate);
            expectedPrevDate.setDate(expectedPrevDate.getDate() - 1);
            if (prevDate.getTime() === expectedPrevDate.getTime()) {
              streakCount++;
            } else {
              break;
            }
          } else {
            streakCount = 1;
          }
          prevDate = currentDate;
        }
        current = streakCount;
        progress = Math.min(100, Math.round((current / target) * 100));
      }
      else if (badge.requirement.type === 'task_streak') {
        const minTasksPerDay = badge.requirement.minTasks || 3;
        const tasksByDay = {};
        const userTasks = await UserTask.find({ userId });
        for (const task of userTasks) {
          const date = new Date(task.completedAt);
          date.setHours(0, 0, 0, 0);
          const dateKey = date.getTime();
          if (!tasksByDay[dateKey]) {
            tasksByDay[dateKey] = [];
          }
          tasksByDay[dateKey].push(task);
        }
        const validDays = Object.keys(tasksByDay)
          .filter(key => tasksByDay[key].length >= minTasksPerDay)
          .map(key => parseInt(key))
          .sort((a, b) => b - a);
        let streakCount = 0;
        for (let i = 0; i < validDays.length; i++) {
          if (i === 0) {
            streakCount = 1;
          } else {
            const currentDay = new Date(validDays[i]);
            const prevDay = new Date(validDays[i - 1]);
            prevDay.setDate(prevDay.getDate() - 1);
            if (currentDay.getTime() === prevDay.getTime()) {
              streakCount++;
            } else {
              break;
            }
          }
        }
        current = streakCount;
        progress = Math.min(100, Math.round((current / target) * 100));
      }

      if (earned) {
         progress = 100;
         current = target;
       }
       
       return {
         ...badge.toObject(),
         earned,
         earnedAt: userBadge ? userBadge.earnedAt : null,
         progress,
         current,
         target
       };
    }));

    const groupedBadges = {
      health: badgesWithStatus.filter(b => b.category === 'health'),
      energy: badgesWithStatus.filter(b => b.category === 'energy'),
      emotion: badgesWithStatus.filter(b => b.category === 'emotion'),
      streak: badgesWithStatus.filter(b => b.category === 'streak')
    };

    res.json({
      success: true,
      badges: groupedBadges,
      earnedCount: userBadges.length,
      totalCount: allBadges.length
    });
  } catch (error) {
    console.error('获取徽章失败:', error);
    res.status(500).json({ success: false, message: '获取徽章失败' });
  }
};

exports.checkAndAwardBadges = async (userId) => {
  try {
    console.log(`=== 开始检查用户 ${userId} 的徽章 ===`);
    
    const user = await User.findById(userId);
    if (!user) {
      console.log('用户不存在');
      return [];
    }

    const allBadges = await Badge.find({ isActive: true });
    console.log(`共有 ${allBadges.length} 个徽章`);
    
    const userBadges = await UserBadge.find({ userId });
    const earnedBadgeIds = userBadges.map(ub => ub.badgeId.toString());
    console.log(`用户已获得 ${userBadges.length} 个徽章`);

    const newBadges = [];

    for (const badge of allBadges) {
      if (earnedBadgeIds.includes(badge._id.toString())) {
        console.log(`跳过已获得徽章: ${badge.name}`);
        continue;
      }

      let shouldAward = false;

      if (badge.requirement.type === 'energy_level') {
        const currentEnergy = user.energyLevel || 0;
        shouldAward = currentEnergy >= badge.requirement.count;
        console.log(`徽章[${badge.name}]: 当前能量=${currentEnergy}, 需要=${badge.requirement.count}, 是否发放=${shouldAward}`);
      } 
      else if (badge.requirement.type === 'total_energy') {
        const totalEnergy = await UserTask.aggregate([
          { $match: { userId } },
          { $group: { _id: null, total: { $sum: '$energyGained' } } }
        ]);
        const total = totalEnergy[0]?.total || 0;
        shouldAward = total >= badge.requirement.count;
        console.log(`徽章[${badge.name}]: 累计能量=${total}, 需要=${badge.requirement.count}, 是否发放=${shouldAward}`);
      }
      else if (badge.requirement.type === 'emotion_count') {
        const emotionCount = await EmotionRecord.countDocuments({ userId });
        shouldAward = emotionCount >= badge.requirement.count;
        console.log(`徽章[${badge.name}]: 情绪记录数=${emotionCount}, 需要=${badge.requirement.count}, 是否发放=${shouldAward}`);
      }
      else if (badge.requirement.type === 'task_count') {
        const taskCodeMap = {
          'meal': ['早餐', '午餐', '晚餐'],
          'exercise': ['运动30分钟'],
          'sleep': ['按时睡觉'],
          'meditation': ['冥想10分钟'],
          'reading': ['阅读'],
          'water': ['喝水'],
          'social': ['与朋友聊天', '帮助他人', '表达感谢'],
          'breathing': ['深呼吸']
        };

        const taskNames = taskCodeMap[badge.requirement.taskCode] || [];
        if (taskNames.length > 0) {
          const tasks = await Task.find({ name: { $in: taskNames } });
          const taskIds = tasks.map(t => t._id);
          
          const taskCount = await UserTask.countDocuments({
            userId,
            taskId: { $in: taskIds }
          });
          
          shouldAward = taskCount >= badge.requirement.count;
        }
      }
      else if (badge.requirement.type === 'happy_streak') {
        const emotions = await EmotionRecord.find({ userId })
          .sort({ createdAt: -1 })
          .limit(badge.requirement.count);
        
        let streakCount = 0;
        let prevDate = null;
        
        for (const emotion of emotions) {
          const currentDate = new Date(emotion.createdAt);
          currentDate.setHours(0, 0, 0, 0);
          
          if (emotion.emotion === 'happy') {
            if (prevDate) {
              const expectedPrevDate = new Date(currentDate);
              expectedPrevDate.setDate(expectedPrevDate.getDate() - 1);
              
              if (prevDate.getTime() === expectedPrevDate.getTime()) {
                streakCount++;
              } else {
                break;
              }
            } else {
              streakCount = 1;
            }
            prevDate = currentDate;
          } else {
            break;
          }
        }
        
        shouldAward = streakCount >= badge.requirement.count;
      }
      else if (badge.requirement.type === 'emotion_streak') {
        const emotions = await EmotionRecord.find({ userId })
          .sort({ createdAt: -1 });
        
        let streakCount = 0;
        let prevDate = null;
        
        for (const emotion of emotions) {
          const currentDate = new Date(emotion.createdAt);
          currentDate.setHours(0, 0, 0, 0);
          
          if (prevDate) {
            const expectedPrevDate = new Date(currentDate);
            expectedPrevDate.setDate(expectedPrevDate.getDate() - 1);
            
            if (prevDate.getTime() === expectedPrevDate.getTime()) {
              streakCount++;
            } else {
              break;
            }
          } else {
            streakCount = 1;
          }
          prevDate = currentDate;
        }
        
        shouldAward = streakCount >= badge.requirement.count;
      }
      else if (badge.requirement.type === 'task_streak') {
        const minTasksPerDay = badge.requirement.minTasks || 3;
        
        const tasksByDay = {};
        const userTasks = await UserTask.find({ userId });
        
        for (const task of userTasks) {
          const date = new Date(task.completedAt);
          date.setHours(0, 0, 0, 0);
          const dateKey = date.getTime();
          if (!tasksByDay[dateKey]) {
            tasksByDay[dateKey] = [];
          }
          tasksByDay[dateKey].push(task);
        }
        
        const validDays = Object.keys(tasksByDay)
          .filter(key => tasksByDay[key].length >= minTasksPerDay)
          .map(key => parseInt(key))
          .sort((a, b) => b - a);
        
        let streakCount = 0;
        for (let i = 0; i < validDays.length; i++) {
          const currentDay = new Date(validDays[i]);
          if (i === 0) {
            streakCount = 1;
          } else {
            const prevDay = new Date(validDays[i - 1]);
            prevDay.setDate(prevDay.getDate() - 1);
            if (currentDay.getTime() === prevDay.getTime()) {
              streakCount++;
            } else {
              break;
            }
          }
        }
        
        console.log(`徽章[${badge.name}]: 有效天数=${validDays.length}, 连续天数=${streakCount}, 需要=${badge.requirement.count}, 每天最少任务数=${minTasksPerDay}`);
        shouldAward = streakCount >= badge.requirement.count;
      }

      if (shouldAward) {
        await UserBadge.create({
          userId,
          badgeId: badge._id,
          earnedAt: new Date()
        });
        newBadges.push(badge);
        console.log(`用户 ${userId} 获得新徽章: ${badge.name}`);
      }
    }

    return newBadges;
  } catch (error) {
    console.error('检查徽章失败:', error);
    return [];
  }
};

exports.checkTaskBadge = async (userId) => {
  return await exports.checkAndAwardBadges(userId);
};

exports.checkEmotionBadge = async (userId) => {
  return await exports.checkAndAwardBadges(userId);
};
