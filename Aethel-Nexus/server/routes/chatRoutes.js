const express = require('express');
const { generateResponse, getAllChats, getSingleChat, clearHistory } = require('../controllers/chatController');

const router = express.Router();

router.post('/', generateResponse);
router.get('/', getAllChats);
router.delete('/', clearHistory); // Deletes all chats
router.get('/:id', getSingleChat);

module.exports = router;