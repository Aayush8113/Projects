const express = require('express');
const { register, login, logout } = require('../controllers/auth.controller');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);

module.exports = router;
