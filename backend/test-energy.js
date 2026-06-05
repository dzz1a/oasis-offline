const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const User = require('./models/User');
    
    const user = await User.findById('6a03dc307cf929e80dc423db').select('-password');
    console.log('用户能量值:', user.energyLevel);
    console.log('用户隐私设置:', user.privacy);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('错误:', err);
    process.exit(1);
  });