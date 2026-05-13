const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const auth = require('../middleware/auth');

router.put('/profile', auth, userController.updateProfile);
router.get('/search', auth, userController.searchUsers);
router.get('/favorites', auth, userController.getFavorites);
router.get('/:id', auth, userController.getUserById);
router.get('/', auth, userController.getAllUsers);
router.post('/favorite', auth, userController.toggleFavorite);

module.exports = router;