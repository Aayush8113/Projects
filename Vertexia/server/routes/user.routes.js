const express = require('express');
const { getUser, updateUser, getAllUsers } = require('../controllers/user.controller');
const { verifyToken, verifyAdmin, verifyUser } = require('../utils/verifyToken');

const router = express.Router();

router.get('/me', verifyToken, getUser);
router.put('/:id', verifyUser, updateUser);
router.get('/', verifyAdmin, getAllUsers);

module.exports = router;
