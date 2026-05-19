const User = require('../models/User');
const Post = require('../models/Post');
const EmotionRecord = require('../models/EmotionRecord');
const bcrypt = require('bcryptjs');

const DEFAULT_PRIVACY = {
  showEnergy: true,
  showEmotionStatus: true,
  showEmotionContent: false,
  displayBadges: []
};

const normalizePrivacy = (privacy) => {
  const raw = privacy?.toObject ? privacy.toObject() : privacy || {};
  return {
    showEnergy: raw.showEnergy !== false,
    showEmotionStatus: raw.showEmotionStatus !== false,
    showEmotionContent: !!raw.showEmotionContent,
    displayBadges: (raw.displayBadges || []).map((id) => id.toString())
  };
};

const buildUserStats = async (userId) => {
  const ObjectId = require('mongoose').Types.ObjectId;
  const user = await User.findById(userId);

  const posts = await Post.find({
    $or: [
      { author: userId },
      { author: new ObjectId(userId) },
      { 'author._id': userId },
      { 'author._id': new ObjectId(userId) }
    ]
  });

  const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);

  return {
    likes: totalLikes,
    posts: posts.length,
    followers: user?.followers?.length || 0,
    following: user?.following?.length || 0
  };
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: '请填写所有字段'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: '两次输入的新密码不一致'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: '新密码长度不能少于6位'
      });
    }

    const user = await User.findById(req.user._id);
    
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: '原密码不正确'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: '密码修改成功'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, bio, avatar, role, energyLevel, tags } = req.body;

    const updates = {};
    if (username) updates.username = username;
    if (bio) updates.bio = bio;
    if (avatar) updates.avatar = avatar;
    if (role) updates.role = role;
    if (energyLevel !== undefined) updates.energyLevel = energyLevel;
    if (tags !== undefined) updates.tags = tags;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: '资料更新成功',
      user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPrivacy = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePrivacy = async (req, res) => {
  try {
    console.log('===== 更新隐私设置 START =====');
    console.log('请求体:', req.body);
    console.log('用户ID:', req.user._id);
    
    const { showEnergy, showEmotionStatus, showEmotionContent, displayBadges } = req.body;

    const updates = {};
    if (showEnergy !== undefined) updates['privacy.showEnergy'] = showEnergy;
    if (showEmotionStatus !== undefined) updates['privacy.showEmotionStatus'] = showEmotionStatus;
    if (showEmotionContent !== undefined) updates['privacy.showEmotionContent'] = showEmotionContent;
    if (displayBadges !== undefined) updates['privacy.displayBadges'] = displayBadges;

    console.log('更新内容:', updates);
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    console.log('更新成功:', user.privacy);
    console.log('===== 更新隐私设置 END =====');
    
    res.json({
      success: true,
      message: '隐私设置更新成功',
      privacy: user.privacy
    });
  } catch (error) {
    console.error('===== 更新隐私设置失败 =====');
    console.error('错误:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const user = await User.findById(targetUserId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const isSelf = req.user._id.toString() === targetUserId.toString();
    const privacy = normalizePrivacy(user.privacy);
    const badgeController = require('./badge');
    const badges = await badgeController.getBadgeList(targetUserId);
    const stats = await buildUserStats(targetUserId);
    const earnedBadges = badges.filter((badge) => badge.earned);

    let displayBadges = [];
    if (privacy.displayBadges.length > 0) {
      displayBadges = badges.filter((badge) =>
        privacy.displayBadges.includes(badge._id.toString())
      );
    } else {
      displayBadges = earnedBadges.slice(0, 3);
    }

    let recentEmotion = null;
    if (privacy.showEmotionStatus) {
      const record = await EmotionRecord.findOne({ userId: targetUserId })
        .sort({ createdAt: -1 })
        .lean();

      if (record) {
        recentEmotion = {
          emotion: record.emotion,
          intensity: record.intensity,
          createdAt: record.createdAt
        };

        if (privacy.showEmotionContent && record.note) {
          recentEmotion.note = record.note;
        }
      }
    }

    const profile = {
      ...user.toObject(),
      privacy,
      badges,
      displayBadges,
      earnedBadgeCount: earnedBadges.length,
      stats,
      recentEmotion,
      postCount: stats.posts,
      followerCount: stats.followers,
      followingCount: stats.following,
      isSelf
    };

    if (!isSelf) {
      delete profile.email;
      if (!privacy.showEnergy) {
        profile.energyLevel = undefined;
      }
    }

    res.json({
      success: true,
      user: profile
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: '请输入搜索关键词'
      });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } }
      ],
      _id: { $ne: req.user._id }
    })
    .select('-password')
    .limit(20);

    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      });
    }

    const user = await User.findById(req.user._id);
    const favIndex = user.favorites.findIndex(
      fav => fav.toString() === postId
    );

    if (favIndex > -1) {
      user.favorites.splice(favIndex, 1);
    } else {
      user.favorites.push(postId);
    }

    await user.save();

    res.json({
      success: true,
      isFavorited: favIndex === -1,
      favoritesCount: user.favorites.length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.followUser = async (req, res) => {
  try {
    const Friend = require('../models/Friend');
    const targetUserId = req.params.id;

    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: '不能关注自己'
      });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const isFriend = await Friend.findOne({
      $or: [
        { userId: req.user._id, friendId: targetUserId, status: 'accepted' },
        { userId: targetUserId, friendId: req.user._id, status: 'accepted' }
      ]
    });

    if (isFriend) {
      return res.status(400).json({
        success: false,
        message: '已经是好友，默认已关注'
      });
    }

    const currentUser = await User.findById(req.user._id);

    const followingIndex = currentUser.following.findIndex(
      id => id.toString() === targetUserId
    );

    if (followingIndex > -1) {
      currentUser.following.splice(followingIndex, 1);
      const followerIndex = targetUser.followers.findIndex(
        id => id.toString() === req.user._id.toString()
      );
      if (followerIndex > -1) {
        targetUser.followers.splice(followerIndex, 1);
      }
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(req.user._id);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      success: true,
      isFollowing: followingIndex === -1,
      followersCount: targetUser.followers.length,
      followingCount: currentUser.following.length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const stats = await buildUserStats(userId);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    console.log('===== 获取收藏列表 START =====');
    console.log('获取收藏列表 - 请求对象:', req);
    console.log('获取收藏列表 - 用户:', req.user);
    
    if (!req.user) {
      console.log('错误: req.user 不存在');
      return res.status(400).json({
        success: false,
        message: '用户未认证'
      });
    }
    
    console.log('获取收藏列表 - 用户ID:', req.user._id);
    
    if (!req.user._id) {
      console.log('错误: 用户ID不存在');
      return res.status(400).json({
        success: false,
        message: '用户ID不存在'
      });
    }
    
    const userIdString = req.user._id.toString();
    console.log('用户ID字符串:', userIdString);
    
    const user = await User.findById(userIdString);
    console.log('用户对象:', user);
    
    if (!user) {
      console.log('错误: 用户不存在');
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    console.log('用户favorites字段:', user.favorites);
    
    const userWithFavorites = await User.findById(userIdString)
      .populate({
        path: 'favorites',
        populate: {
          path: 'author',
          select: '-password'
        }
      });
    
    console.log('用户收藏数:', userWithFavorites.favorites.length);
    console.log('用户收藏内容:', userWithFavorites.favorites);

    res.json({
      success: true,
      favorites: userWithFavorites.favorites
    });
    console.log('===== 获取收藏列表 END =====');
  } catch (error) {
    console.error('===== 获取收藏列表 ERROR =====');
    console.error('获取收藏列表失败:', error);
    console.error('错误堆栈:', error.stack);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};