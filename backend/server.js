require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const { initSocket } = require('./socket');

const app = express();
const server = http.createServer(app);

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

async function startServer() {
  try {
    await connectDB();
    console.log('MongoDB连接成功');

    app.use(cors());
    app.use(express.json());

    const authRoutes = require('./routes/auth');
    const userRoutes = require('./routes/user');
    const friendRoutes = require('./routes/friend');
    const chatRoutes = require('./routes/chat');
    const forumRoutes = require('./routes/forum');
    const emotionRoutes = require('./routes/emotion');
    const taskRoutes = require('./routes/task');
    const badgeRoutes = require('./routes/badge');
    const todoRoutes = require('./routes/todo');

    const { initializeTasks } = require('./controllers/task');
    const { initializeBadges } = require('./controllers/badge');

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/friends', friendRoutes);
    app.use('/api/chat', chatRoutes);
    app.use('/api/forum', forumRoutes);
    app.use('/api/emotions', emotionRoutes);
    app.use('/api/tasks', taskRoutes);
    app.use('/api/badges', badgeRoutes);
    app.use('/api/todos', todoRoutes);

    await initializeTasks();
    await initializeBadges();

    app.get('/', (req, res) => {
      res.json({
        success: true,
        message: '离线绿洲后端服务运行正常',
        version: '1.0.0'
      });
    });

    initSocket(server);

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error.message);
    process.exit(1);
  }
}

startServer();