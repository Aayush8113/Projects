const express = require('express');
const {
    createOrder,
    updateOrder,
    deleteOrder,
    getUserOrders,
    getAllOrders,
    getIncome,
    getSellerOrders
} = require('../controllers/order.controller');
const { verifyToken, verifyAdmin, verifyUser } = require('../utils/verifyToken');

const router = express.Router();

router.post('/', verifyToken, createOrder);
router.get('/seller', verifySeller, getSellerOrders);
router.put('/:id', verifyAdmin, updateOrder);
router.delete('/:id', verifyAdmin, deleteOrder);
router.get('/find/:userId', verifyUser, getUserOrders);
router.get('/', verifyAdmin, getAllOrders);
router.get('/income', verifyAdmin, getIncome);

module.exports = router;
