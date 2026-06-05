const mongoose = require('mongoose');
require('dotenv').config();

async function updateBadge() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const Badge = require('./models/Badge');
  await Badge.updateOne(
    { code: 'emotion_14' },
    { name: '心灵记录者', icon: '✍️' }
  );
  
  const updatedBadge = await Badge.findOne({ code: 'emotion_14' });
  console.log('更新后的徽章:', updatedBadge);
  
  process.exit(0);
}

updateBadge().catch(err => {
  console.error(err);
  process.exit(1);
});