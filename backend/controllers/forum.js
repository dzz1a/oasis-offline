const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    console.log('收到发帖请求:', req.body);
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: '标题和内容不能为空'
      });
    }

    const post = await Post.create({
      author: req.user._id,
      title,
      content,
      tags: tags || []
    });

    await post.populate('author', '-password');

    const postData = post.toObject();
    postData.likes = postData.likes.map(id => id.toString());

    console.log('发帖成功:', postData._id);
    res.json({
      success: true,
      post: postData
    });
  } catch (error) {
    console.error('发帖失败:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', '-password')
      .populate('comments.author', '-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      posts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', '-password')
      .populate('comments.author', '-password');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      });
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      });
    }

    const likeIndex = post.likes.indexOf(req.user._id);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    await post.populate('author', '-password');

    res.json({
      success: true,
      post
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content, replyTo, replyToComment } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      });
    }

    post.comments.push({
      author: req.user._id,
      content,
      replyTo: replyTo || null,
      replyToComment: replyToComment || null
    });

    await post.save();
    await post.populate('author', '-password');
    await post.populate('comments.author', '-password');
    await post.populate('comments.replyTo', '-password');

    res.json({
      success: true,
      post
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '无权删除此帖子'
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};