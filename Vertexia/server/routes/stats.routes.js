const express = require('express');
const { getAdminStats, getSellerStats } = require('../controllers/stats.controller');
const { verifyAdmin, verifySeller } = require('../utils/verifyToken');

const router = express.Router();

// Admin Stats
router.get('/admin', verifyAdmin, getAdminStats);

// Seller Stats
router.get('/seller', verifySeller, getSellerStats);

module.exports = router;
