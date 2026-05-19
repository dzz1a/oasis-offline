const express = require('express');
const router = express.Router();
const {
  createEmotionRecord,
  getEmotionRecords,
  getEmotionRecordById,
  updateEmotionRecord,
  deleteEmotionRecord
} = require('../controllers/emotion');
const auth = require('../middleware/auth');

router.post('/', auth, createEmotionRecord);
router.get('/', auth, getEmotionRecords);
router.get('/:id', auth, getEmotionRecordById);
router.put('/:id', auth, updateEmotionRecord);
router.delete('/:id', auth, deleteEmotionRecord);

module.exports = router;