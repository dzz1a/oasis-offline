const Task = require('../models/Task');
const UserTask = require('../models/UserTask');
const User = require('../models/User');
const { checkAndAwardBadges } = require('./badge');

const defaultTasks = [
  {
    name: '早餐',
    category: 'physical',
    icon: '🍳',
    energyReward: 10,
    description: '按时吃早餐'
  },
  {
    name: '午餐',
    category: 'physical',
    icon: '🍱',
    energyReward: 10,
    description: '按时吃午餐'
  },
  {
    name: '晚餐',
    category: 'physical',
    icon: '🍽️',
    energyReward: 10,
    description: '按时吃晚餐'
  },
  {
    name: '喝水',
    category: 'physical',
    icon: '💧',
    energyReward: 5,
    description: '喝一杯水',
    dailyLimit: 8
  },
  {
    name: '运动30分钟',
    category: 'physical',
    icon: '🏃',
    energyReward: 15,
    description: '进行30分钟运动'
  },
  {
    name: '按时睡觉',
    category: 'physical',
    icon: '😴',
    energyReward: 20,
    description: '23点前睡觉'
  },
  {
    name: '记录情绪',
    category: 'mental',
    icon: '😊',
    energyReward: 8,
    description: '记录今日情绪'
  },
  {
    name: '冥想10分钟',
    category: 'mental',
    icon: '🧘',
    energyReward: 12,
    description: '冥想放松10分钟'
  },
  {
    name: '阅读',
    category: 'mental',
    icon: '📚',
    energyReward: 10,
    description: '阅读有益书籍'
  },
  {
    name: '深呼吸',
    category: 'mental',
    icon: '🌬️',
    energyReward: 5,
    description: '完成深呼吸练习'
  },
  {
    name: '正念日记',
    category: 'mental',
    icon: '✍️',
    energyReward: 10,
    description: '写一篇正念日记'
  },
  {
    name: '与朋友聊天',
    category: 'social',
    icon: '💬',
    energyReward: 8,
    description: '与朋友聊天交流'
  },
  {
    name: '帮助他人',
    category: 'social',
    icon: '🤝',
    energyReward: 15,
    description: '帮助他人做一件事'
  },
  {
    name: '表达感谢',
    category: 'social',
    icon: '🙏',
    energyReward: 5,
    description: '向他人表达感谢'
  }
];

exports.initializeTasks = async () => {
  try {
    const count = await Task.countDocuments();
    if (count === 0) {
      await Task.insertMany(defaultTasks);
      console.log('默认任务已初始化');
    }
  } catch (error) {
    console.error('初始化任务失败:', error);
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ isActive: true }).sort({ category: 1, energyReward: -1 });
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取任务列表失败' });
  }
};

exports.getTodayTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const user = await User.findById(userId);
    console.log('用户能量值:', user?.energyLevel);
    const completedTasks = await UserTask.find({
      userId,
      completedAt: { $gte: today, $lt: tomorrow }
    }).populate('taskId');

    const allTasks = await Task.find({ isActive: true });
    
    const completedTaskIds = completedTasks.map(ut => ut.taskId._id.toString());
    
    const tasksWithStatus = allTasks.map(task => {
      const completedCount = completedTasks.filter(
        ut => ut.taskId._id.toString() === task._id.toString()
      ).length;
      
      return {
        ...task.toObject(),
        completedCount,
        canComplete: completedCount < task.dailyLimit,
        isCompleted: completedCount >= task.dailyLimit
      };
    });

    const physicalTasks = tasksWithStatus.filter(t => t.category === 'physical');
    const mentalTasks = tasksWithStatus.filter(t => t.category === 'mental');
    const socialTasks = tasksWithStatus.filter(t => t.category === 'social');

    const totalEnergy = completedTasks.reduce((sum, ut) => sum + ut.energyGained, 0);
    const maxEnergy = allTasks.reduce((sum, t) => sum + t.energyReward * t.dailyLimit, 0);
    
    console.log('返回的当前能量值:', user?.energyLevel || 0);

    res.json({
      success: true,
      tasks: {
        physical: physicalTasks,
        mental: mentalTasks,
        social: socialTasks
      },
      stats: {
        completedCount: completedTasks.length,
        totalEnergy,
        maxEnergy,
        currentEnergy: user?.energyLevel || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取今日任务失败' });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: '任务不存在' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCompleted = await UserTask.countDocuments({
      userId,
      taskId,
      completedAt: { $gte: today, $lt: tomorrow }
    });

    if (todayCompleted >= task.dailyLimit) {
      return res.status(400).json({ 
        success: false, 
        message: '今日已完成此任务，请明天再来！' 
      });
    }

    const userTask = new UserTask({
      userId,
      taskId,
      completedAt: new Date(),
      energyGained: task.energyReward
    });

    await userTask.save();

    const user = await User.findById(userId);
    user.energyLevel = (user.energyLevel || 0) + task.energyReward;
    await user.save();

    await checkAndAwardBadges(userId);

    const totalEnergy = await UserTask.aggregate([
      {
        $match: {
          userId,
          completedAt: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$energyGained' }
        }
      }
    ]);

    res.json({
      success: true,
      message: `${task.icon} ${task.name} 完成！+${task.energyReward}能量`,
      energyGained: task.energyReward,
      totalEnergy: totalEnergy[0]?.total || task.energyReward,
      newEnergyLevel: user.energyLevel
    });
  } catch (error) {
    console.error('完成任务失败:', error);
    res.status(500).json({ success: false, message: '完成任务失败' });
  }
};
