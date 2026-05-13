const Friend = require('../models/Friend');
const User = require('../models/User');

exports.sendFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;

    if (req.user._id.toString() === friendId) {
      return res.status(400).json({
        success: false,
        message: '不能添加自己为好友'
      });
    }

    const existingRequest = await Friend.findOne({
      $or: [
        { userId: req.user._id, friendId },
        { userId: friendId, friendId: req.user._id }
      ]
    });

    if (existingRequest) {
      let message = '';
      if (existingRequest.status === 'accepted') {
        message = '已经是好友';
      } else if (existingRequest.userId.toString() === req.user._id.toString()) {
        message = '好友请求已发送';
      } else {
        message = '对方已向你发送好友请求，请先接受';
      }
      return res.status(400).json({
        success: false,
        message
      });
    }

    await Friend.create({
      userId: req.user._id,
      friendId
    });

    res.json({
      success: true,
      message: '好友请求已发送'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await Friend.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: '请求不存在'
      });
    }

    if (request.friendId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '无权处理此请求'
      });
    }

    request.status = 'accepted';
    await request.save();

    res.json({
      success: true,
      message: '已添加好友'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await Friend.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: '请求不存在'
      });
    }

    if (request.friendId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '无权处理此请求'
      });
    }

    request.status = 'rejected';
    await request.save();

    res.json({
      success: true,
      message: '已拒绝好友请求'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const { friendId } = req.body;

    await Friend.deleteOne({
      $or: [
        { userId: req.user._id, friendId, status: 'accepted' },
        { userId: friendId, friendId: req.user._id, status: 'accepted' }
      ]
    });

    res.json({
      success: true,
      message: '已删除好友'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const friends = await Friend.find({
      $or: [
        { userId: req.user._id, status: 'accepted' },
        { friendId: req.user._id, status: 'accepted' }
      ]
    })
    .populate({
      path: 'userId friendId',
      select: '-password'
    });

    const friendList = friends.map(friend => {
      return friend.userId._id.toString() === req.user._id.toString()
        ? friend.friendId
        : friend.userId;
    });

    res.json({
      success: true,
      friends: friendList
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getFriendRequests = async (req, res) => {
  try {
    const requests = await Friend.find({
      friendId: req.user._id,
      status: 'pending'
    })
    .populate('userId', '-password')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests: requests.map(req => ({
        id: req._id,
        user: req.userId,
        createdAt: req.createdAt
      }))
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};