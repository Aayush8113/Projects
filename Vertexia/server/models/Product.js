const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        discountedPrice: {
            type: Number,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        subCategory: {
            type: String,
            required: true,
            trim: true,
        },
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        images: [
            {
                url: { type: String, required: true },
                alt: { type: String, default: '' },
            },
        ],
        inventory: {
            type: Number,
            required: true,
            default: 0,
        },
        specifications: {
            type: Map,
            of: String, // e.g., "Brand": "Apple", "RAM": "8GB"
        },
        modelConfig: {
            type: Map,
            of: String, // e.g., "type": "smartphone", "color": "#ff0000"
            default: {}
        },
        ratings: {
            average: { type: Number, default: 0 },
            count: { type: Number, default: 0 },
        },
        reviews: [
            {
                user: String,
                rating: Number,
                comment: String,
                date: { type: Date, default: Date.now }
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
