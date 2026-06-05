const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['health', 'energy', 'emotion', 'streak'],
    required: true 
  },
  requirement: {
    type: { type: String, required: true },
    count: { type: Number, required: true },
    taskCode: { type: String }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Badge', badgeSchema);
