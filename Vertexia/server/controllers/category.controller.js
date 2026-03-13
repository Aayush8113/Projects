const Category = require('../models/Category');

const createCategory = async (req, res, next) => {
    const newCategory = new Category(req.body);
    try {
        const savedCategory = await newCategory.save();
        res.status(201).json({ success: true, category: savedCategory });
    } catch (err) {
        next(err);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json({ success: true, category: updatedCategory });
    } catch (err) {
        next(err);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Category has been deleted...' });
    } catch (err) {
        next(err);
    }
};

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().populate('parentCategory');
        res.status(200).json({ success: true, categories });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories,
};
