const Order = require('../models/Order');
const ErrorHandler = require('../utils/ErrorHandler');

const createOrder = async (req, res, next) => {
    const newOrder = new Order({ ...req.body, buyerId: req.user.id });
    try {
        const savedOrder = await newOrder.save();
        res.status(201).json({ success: true, order: savedOrder });
    } catch (err) {
        next(err);
    }
};

const updateOrder = async (req, res, next) => {
    try {
        let order = await Order.findById(req.params.id);
        if (!order) return next(new ErrorHandler('Order not found', 404));

        order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json({ success: true, order });
    } catch (err) {
        next(err);
    }
};

const deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return next(new ErrorHandler('Order not found', 404));

        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Order has been deleted...' });
    } catch (err) {
        next(err);
    }
};

const getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ buyerId: req.params.userId }).populate('items.productId');
        res.status(200).json({ success: true, orders });
    } catch (err) {
        next(err);
    }
};

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find();
        res.status(200).json({ success: true, orders });
    } catch (err) {
        next(err);
    }
};

// GET MONTHLY INCOME
const getIncome = async (req, res, next) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: '$createdAt' },
                    sales: '$totalAmount',
                },
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: '$sales' },
                },
            },
        ]);
        res.status(200).json({ success: true, income });
    } catch (err) {
        next(err);
    }
};

const getSellerOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ 'items.sellerId': req.user.id }).populate('items.productId');
        res.status(200).json({ success: true, orders });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createOrder,
    updateOrder,
    deleteOrder,
    getUserOrders,
    getAllOrders,
    getIncome,
    getSellerOrders
};
