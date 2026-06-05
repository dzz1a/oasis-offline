const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['physical', 'mental', 'social', 'achievement'],
    required: true 
  },
  icon: { type: String, required: true },
  energyReward: { type: Number, required: true },
  description: { type: String, default: '' },
  dailyLimit: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
