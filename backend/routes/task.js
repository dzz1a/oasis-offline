const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task');
const auth = require('../middleware/auth');

router.get('/all', auth, taskController.getAllTasks);
router.get('/today', auth, taskController.getTodayTasks);
router.post('/complete', auth, taskController.completeTask);

module.exports = router;
