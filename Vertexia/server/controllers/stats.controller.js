const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');

const getAdminStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalCategories = await Category.countDocuments();
        const activeSellers = await User.countDocuments({ role: 'seller' });

        const orders = await Order.find();
        const totalSales = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalSales,
                totalProducts,
                activeSellers,
            }
        });
    } catch (err) {
        next(err);
    }
};

const getSellerStats = async (req, res, next) => {
    const sellerId = req.user.id;
    const date = new Date();
    const thirtyDaysAgo = new Date(date.setDate(date.getDate() - 30));

    try {
        // 1. Total Products
        const totalProducts = await Product.countDocuments({ sellerId });

        // 2. Orders containing seller's products
        const orders = await Order.find({
            'items.sellerId': sellerId
        });

        // 3. Revenue & Sales Trend
        let totalRevenue = 0;
        const salesByDay = {}; // { 'YYYY-MM-DD': revenue }

        orders.forEach(order => {
            let orderRevenueForSeller = 0;
            order.items.forEach(item => {
                if (item.sellerId.toString() === sellerId) {
                    const itemRev = (item.price || 0) * (item.quantity || 1);
                    orderRevenueForSeller += itemRev;
                    totalRevenue += itemRev;
                }
            });

            const day = new Date(order.createdAt).toISOString().split('T')[0];
            salesByDay[day] = (salesByDay[day] || 0) + orderRevenueForSeller;
        });

        // 4. Format trend for last 30 days
        const trend = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayStr = d.toISOString().split('T')[0];
            trend.push({
                date: dayStr,
                sales: salesByDay[dayStr] || 0
            });
        }

        res.status(200).json({
            success: true,
            stats: {
                totalProducts,
                totalRevenue,
                totalOrders: orders.length,
                trend
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAdminStats,
    getSellerStats,
};
