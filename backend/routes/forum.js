const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forum');
const auth = require('../middleware/auth');

router.post('/posts', auth, forumController.createPost);
router.get('/posts', auth, forumController.getAllPosts);
router.get('/posts/:id', auth, forumController.getPostById);
router.put('/posts/:id/like', auth, forumController.likePost);
router.post('/posts/:id/comments', auth, forumController.addComment);
router.delete('/posts/:id', auth, forumController.deletePost);

module.exports = router;