const Todo = require('../models/Todo');

exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      todos
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.createTodo = async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '请输入待办事项内容'
      });
    }
    
    const todo = await Todo.create({
      userId: req.user._id,
      title: title.trim()
    });
    
    res.json({
      success: true,
      todo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    
    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { completed },
      { new: true }
    );
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: '待办事项不存在'
      });
    }
    
    res.json({
      success: true,
      todo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const todo = await Todo.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: '待办事项不存在'
      });
    }
    
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