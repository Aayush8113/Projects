const Product = require('../models/Product');
const ErrorHandler = require('../utils/ErrorHandler');

const createProduct = async (req, res, next) => {
    try {
        const newProduct = new Product({
            ...req.body,
            sellerId: req.user.id,
        });
        const savedProduct = await newProduct.save();
        res.status(201).json({ success: true, product: savedProduct });
    } catch (err) {
        next(err);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return next(new ErrorHandler('Product not found', 404));

        // Check if seller owns product or is admin
        if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorHandler('You are not authorized to update this product', 403));
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json({ success: true, product: updatedProduct });
    } catch (err) {
        next(err);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return next(new ErrorHandler('Product not found', 404));

        if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorHandler('You are not authorized to delete this product', 403));
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Product has been deleted.' });
    } catch (err) {
        next(err);
    }
};

const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) return next(new ErrorHandler('Product not found', 404));
        res.status(200).json({ success: true, product });
    } catch (err) {
        next(err);
    }
};

const getAllProducts = async (req, res, next) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    const limit = parseInt(req.query.limit) || 0;

    try {
        let products;

        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(limit || 5).populate('category');
        } else if (qCategory) {
            products = await Product.find({
                category: {
                    $in: [qCategory],
                },
            }).limit(limit).populate('category');
        } else {
            products = await Product.find().limit(limit).populate('category');
        }

        res.status(200).json({ success: true, products });
    } catch (err) {
        next(err);
    }
};

const getSellerProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ sellerId: req.user.id }).populate('category');
        res.status(200).json({ success: true, products });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getAllProducts,
    getSellerProducts,
};
