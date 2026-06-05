const EmotionRecord = require('../models/EmotionRecord');
const { checkAndAwardBadges } = require('./badge');

exports.createEmotionRecord = async (req, res) => {
  try {
    const { emotion, intensity = 5, note = '', date } = req.body;
    
    const recordData = {
      userId: req.user.id,
      emotion,
      intensity,
      note
    };
    
    if (date) {
      recordData.createdAt = new Date(date);
    }
    
    const newRecord = new EmotionRecord(recordData);
    
    await newRecord.save();
    
    await checkAndAwardBadges(req.user.id);
    
    res.status(201).json({ success: true, data: newRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: '创建情绪记录失败', error: error.message });
  }
};

exports.getEmotionRecords = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    let query = { userId: req.user.id };
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      query.createdAt = { $gte: startDate, $lt: endDate };
    }
    
    const records = await EmotionRecord.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取情绪记录失败', error: error.message });
  }
};

exports.getEmotionRecordById = async (req, res) => {
  try {
    const record = await EmotionRecord.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!record) {
      return res.status(404).json({ success: false, message: '情绪记录不存在' });
    }
    
    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取情绪记录失败', error: error.message });
  }
};

exports.updateEmotionRecord = async (req, res) => {
  try {
    const { emotion, intensity, note } = req.body;
    
    const record = await EmotionRecord.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { emotion, intensity, note },
      { new: true }
    );
    
    if (!record) {
      return res.status(404).json({ success: false, message: '情绪记录不存在' });
    }
    
    await checkAndAwardBadges(req.user.id);
    
    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新情绪记录失败', error: error.message });
  }
};

exports.deleteEmotionRecord = async (req, res) => {
  try {
    const record = await EmotionRecord.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!record) {
      return res.status(404).json({ success: false, message: '情绪记录不存在' });
    }
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除情绪记录失败', error: error.message });
  }
};