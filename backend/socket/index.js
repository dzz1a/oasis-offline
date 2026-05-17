const Message = require('../models/Message');

let io;

const connectedUsers = new Map();

const initSocket = (server) => {
  io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('用户连接:', socket.id);

    socket.on('authenticate', async (token) => {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        connectedUsers.set(decoded.id, socket.id);
        socket.userId = decoded.id;
        console.log(`用户 ${decoded.id} 已认证`);
      } catch (error) {
        console.error('认证失败:', error.message);
        socket.disconnect();
      }
    });

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`用户 ${socket.userId} 加入房间: ${roomId}`);
    });

    socket.on('sendMessage', async (data) => {
      try {
        const { from, to, content, type = 'text' } = data;
        const roomId = [from, to].sort().join('-');

        const message = await Message.create({
          from,
          to,
          content,
          type
        });

        await message.populate('from to', '-password');

        const recipientSocketId = connectedUsers.get(to);
        if (recipientSocketId) {
          io.to(recipientSocketId).to(socket.id).emit('newMessage', message);
        } else {
          io.to(socket.id).emit('newMessage', message);
        }
      } catch (error) {
        console.error('发送消息失败:', error.message);
      }
    });

    socket.on('markAsRead', async (data) => {
      try {
        const { friendId } = data;
        await Message.updateMany(
          { from: friendId, to: socket.userId, read: false },
          { read: true }
        );
      } catch (error) {
        console.error('标记已读失败:', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('用户断开连接:', socket.id);
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
      }
    });
  });
};

const getIo = () => io;

module.exports = { initSocket, getIo, connectedUsers };