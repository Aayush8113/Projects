const express = require('express');
const router = express.Router();
const { 
  addBook, getBooks, lendBook, reserveBook, returnBook, transferBook, extendBook, getReadingNudge, getLentHistory 
} = require('../controllers/bookController');
const { 
  getAiChatResponse, getAiSuggestion, analyzeBookMetadata 
} = require('../controllers/aiController');
const { protect } = require('../utils/authMiddleware');

router.use(protect);

router.post('/ai/analyze', analyzeBookMetadata);
router.get('/ai/suggest', getAiSuggestion);      
router.post('/ai/chat', getAiChatResponse);      

router.route('/').post(addBook).get(getBooks);
router.patch('/:id/lend', lendBook);
router.patch('/:id/return', returnBook);
router.patch('/:id/transfer', transferBook);
router.patch('/:id/extend', extendBook);
router.post('/:id/reserve', reserveBook); 

router.get('/nudge', getReadingNudge);
router.get('/history/lent', getLentHistory);

module.exports = router;