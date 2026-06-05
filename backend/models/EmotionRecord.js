const mongoose = require('mongoose');

const emotionRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emotion: {
    type: String,
    enum: ['happy', 'sad', 'anxious', 'angry', 'calm', 'excited', 'tired', 'hopeful'],
    required: true
  },
  intensity: {
    type: Number,
    default: 5,
    min: 1,
    max: 10
  },
  note: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

emotionRecordSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('EmotionRecord', emotionRecordSchema);