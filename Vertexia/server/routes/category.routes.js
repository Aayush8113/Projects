const express = require('express');
const {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories,
} = require('../controllers/category.controller');
const { verifyAdmin } = require('../utils/verifyToken');

const router = express.Router();

router.post('/', verifyAdmin, createCategory);
router.put('/:id', verifyAdmin, updateCategory);
router.delete('/:id', verifyAdmin, deleteCategory);
router.get('/', getCategories);

module.exports = router;
