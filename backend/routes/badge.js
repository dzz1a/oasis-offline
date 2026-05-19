const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badge');
const auth = require('../middleware/auth');

router.get('/user', auth, badgeController.getUserBadges);

module.exports = router;
