const User = require('../models/User');
const Post = require('../models/Post');

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

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

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