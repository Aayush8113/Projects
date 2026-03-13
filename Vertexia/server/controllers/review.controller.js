const Review = require('../models/Review');
const ErrorHandler = require('../utils/ErrorHandler');
const Product = require('../models/Product');

exports.addReview = async (req, res, next) => {
    try {
        const { productId, rating, comment } = req.body;

        if (!productId || !rating || !comment) {
            return next(new ErrorHandler("Please provide all review details (product, rating, comment).", 400));
        }
        const buyerId = req.user.id;

        const newReview = new Review({
            productId,
            buyerId,
            rating,
            comment
        });

        await newReview.save();
        res.status(201).json({ success: true, review: newReview });
    } catch (error) {
        next(error);
    }
};

exports.getProductReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
            .populate('buyerId', 'name profileImage')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        next(error);
    }
};
