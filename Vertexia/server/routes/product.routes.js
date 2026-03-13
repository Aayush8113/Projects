const express = require('express');
const {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getAllProducts,
    getSellerProducts,
} = require('../controllers/product.controller');
const { verifySeller, verifyAdmin } = require('../utils/verifyToken');

const router = express.Router();

router.post('/', verifySeller, createProduct);
router.put('/:id', verifySeller, updateProduct);
router.delete('/:id', verifySeller, deleteProduct); // verifySeller or Admin
router.get('/find/:id', getProduct);
router.get('/', getAllProducts);
router.get('/seller', verifySeller, getSellerProducts);

module.exports = router;
