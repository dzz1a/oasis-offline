const mongoose = require('mongoose');

const userTaskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  completedAt: { type: Date, default: Date.now },
  energyGained: { type: Number, required: true }
});

userTaskSchema.index({ userId: 1, taskId: 1, completedAt: 1 });

module.exports = mongoose.model('UserTask', userTaskSchema);
