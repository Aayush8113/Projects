const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { verifyToken } = require('../utils/verifyToken');

router.post('/', verifyToken, reviewController.addReview);
router.get('/:productId', reviewController.getProductReviews);

module.exports = router;
