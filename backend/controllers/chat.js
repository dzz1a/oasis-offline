const Message = require('../models/Message');
const Friend = require('../models/Friend');
const Post = require('../models/Post');

exports.getMessages = async (req, res) => {
  try {
    const { friendId } = req.params;

    const isFriend = await Friend.findOne({
      $or: [
        { userId: req.user._id, friendId, status: 'accepted' },
        { userId: friendId, friendId: req.user._id, status: 'accepted' }
      ]
    });

    if (!isFriend) {
      return res.status(403).json({
        success: false,
        message: '只有好友才能发送消息'
      });
    }

    const messages = await Message.find({
      $or: [
        { from: req.user._id, to: friendId },
        { from: friendId, to: req.user._id }
      ]
    })
    .populate('from to', '-password')
    .sort({ createdAt: 1 });

    await Message.updateMany(
      { from: friendId, to: req.user._id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { to, content, type = 'text' } = req.body;

    const isFriend = await Friend.findOne({
      $or: [
        { userId: req.user._id, friendId: to, status: 'accepted' },
        { userId: to, friendId: req.user._id, status: 'accepted' }
      ]
    });

    if (!isFriend) {
      return res.status(403).json({
        success: false,
        message: '只有好友才能发送消息'
      });
    }

    const message = await Message.create({
      from: req.user._id,
      to,
      content,
      type
    });

    await message.populate('from to', '-password');

    const { getIo, connectedUsers } = require('../socket');
    const io = getIo();
    const recipientSocketId = connectedUsers.get(to.toString());
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('newMessage', message);
    }

    res.json({
      success: true,
      message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getChatList = async (req, res) => {
  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { from: req.user._id },
            { to: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$from', req.user._id] },
              then: '$to',
              else: '$from'
            }
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$to', req.user._id] }, { $eq: ['$read', false] }] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          unreadCount: 1,
          user: {
            _id: '$user._id',
            username: '$user.username',
            avatar: '$user.avatar'
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    res.json({
      success: true,
      chats: messages
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { friendId } = req.body;

    await Message.updateMany(
      { from: friendId, to: req.user._id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: '已标记为已读'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.sharePost = async (req, res) => {
  try {
    const { friendId, postId } = req.body;

    const isFriend = await Friend.findOne({
      $or: [
        { userId: req.user._id, friendId, status: 'accepted' },
        { userId: friendId, friendId: req.user._id, status: 'accepted' }
      ]
    });

    if (!isFriend) {
      return res.status(403).json({
        success: false,
        message: '只有好友才能分享'
      });
    }

    const post = await Post.findById(postId).populate('author', '-password');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      });
    }

    const shareContent = JSON.stringify({
      type: 'post',
      postId: post._id,
      title: post.title,
      content: post.content.slice(0, 100) + (post.content.length > 100 ? '...' : ''),
      author: post.author.username,
      tags: post.tags.slice(0, 3)
    });

    const message = await Message.create({
      from: req.user._id,
      to: friendId,
      content: shareContent,
      type: 'share'
    });

    await message.populate('from to', '-password');

    const { getIo, connectedUsers } = require('../socket');
    const io = getIo();
    const recipientSocketId = connectedUsers.get(friendId.toString());
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('newMessage', message);
    }

    res.json({
      success: true,
      message: message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};