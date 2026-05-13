const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friend');
const auth = require('../middleware/auth');

router.post('/request', auth, friendController.sendFriendRequest);
router.post('/accept', auth, friendController.acceptFriendRequest);
router.post('/reject', auth, friendController.rejectFriendRequest);
router.post('/remove', auth, friendController.removeFriend);
router.get('/', auth, friendController.getFriends);
router.get('/requests', auth, friendController.getFriendRequests);

module.exports = router;