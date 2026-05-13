const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('认证中间件 - 请求路径:', req.path);
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('认证中间件 - Token存在:', !!token);
    
    if (!token) {
      console.log('认证失败: 没有token');
      return res.status(401).json({ message: '未授权，请先登录' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('认证中间件 - 解码结果:', decoded);
    
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log('认证失败: 用户不存在');
      return res.status(401).json({ message: '用户不存在' });
    }

    req.user = user;
    console.log('认证成功 - 用户ID:', user._id);
    next();
  } catch (error) {
    console.error('认证失败:', error);
    res.status(401).json({ message: 'token无效或已过期' });
  }
};

module.exports = auth;