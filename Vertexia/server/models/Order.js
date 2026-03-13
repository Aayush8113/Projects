const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        buyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                sellerId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                title: String,
                price: Number,
                quantity: { type: Number, required: true, default: 1 },
                image: String,
            },
        ],
        shippingAddress: {
            street: String,
            city: String,
            state: String,
            country: String,
            zipCode: String,
        },
        paymentMethod: {
            type: String,
            required: true,
            default: 'Card', // or PayPal, Stripe, COD
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
            default: 'Pending',
        },
        paymentIntentId: {
            type: String, // for Stripe
        },
        orderStatus: {
            type: String,
            enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Processing',
        },
        totalAmount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
