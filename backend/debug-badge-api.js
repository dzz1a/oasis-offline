const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 模拟徽章API
app.get('/api/badges/user', (req, res) => {
  console.log('收到徽章API请求');
  
  // 模拟用户已获得的徽章数据
  const mockBadges = {
    success: true,
    badges: {
      health: [
        { _id: '1', name: '按时吃饭', icon: '🥗', category: 'health', earned: false },
        { _id: '2', name: '运动达人', icon: '🏃', category: 'health', earned: false },
        { _id: '3', name: '早睡早起', icon: '😴', category: 'health', earned: false },
        { _id: '4', name: '冥想大师', icon: '🧘', category: 'health', earned: false },
        { _id: '5', name: '阅读爱好者', icon: '📚', category: 'health', earned: false },
        { _id: '6', name: '喝水达人', icon: '💧', category: 'health', earned: false },
        { _id: '7', name: '社交达人', icon: '💝', category: 'health', earned: false },
        { _id: '8', name: '呼吸练习', icon: '🌬️', category: 'health', earned: false }
      ],
      energy: [
        { _id: '9', name: '能量满满', icon: '⚡', category: 'energy', earned: true },
        { _id: '10', name: '超级能量', icon: '🔋', category: 'energy', earned: true },
        { _id: '11', name: '能量王者', icon: '🌟', category: 'energy', earned: false }
      ],
      emotion: [
        { _id: '12', name: '情绪观察者', icon: '😊', category: 'emotion', earned: true },
        { _id: '13', name: '情绪达人', icon: '🌈', category: 'emotion', earned: false },
        { _id: '14', name: '心态积极', icon: '🎭', category: 'emotion', earned: true },
        { _id: '15', name: '心灵记录者', icon: '✍️', category: 'emotion', earned: true }
      ],
      streak: [
        { _id: '16', name: '坚持3天', icon: '📅', category: 'streak', earned: false },
        { _id: '17', name: '坚持7天', icon: '📅', category: 'streak', earned: false },
        { _id: '18', name: '坚持30天', icon: '🏆', category: 'streak', earned: false }
      ]
    },
    earnedCount: 5,
    totalCount: 18
  };

  res.json(mockBadges);
});

app.listen(5001, () => {
  console.log('调试服务器运行在 http://localhost:5001');
});