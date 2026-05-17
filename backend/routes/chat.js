const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');
const auth = require('../middleware/auth');

router.get('/messages/:friendId', auth, chatController.getMessages);
router.post('/send', auth, chatController.sendMessage);
router.get('/list', auth, chatController.getChatList);
router.post('/read', auth, chatController.markAsRead);
router.post('/share', auth, chatController.sharePost);

module.exports = router;