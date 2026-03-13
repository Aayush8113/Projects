const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        subCategories: [{
            type: String,
            trim: true
        }],
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            default: null, // null means it's a top-level category
        },
        description: {
            type: String,
        },
        image: {
            type: String, // URL to category image
        },
        attributes: [
            {
                type: String, // e.g., 'Brand', 'RAM', 'Storage', 'Color'
            }
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
