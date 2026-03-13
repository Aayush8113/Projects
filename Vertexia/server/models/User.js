const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: ['buyer', 'seller', 'admin'],
            default: 'buyer',
        },
        status: {
            type: String,
            enum: ['active', 'suspended'],
            default: 'active',
        },
        addresses: [
            {
                street: String,
                city: String,
                state: String,
                country: String,
                zipCode: String,
                isDefault: { type: Boolean, default: false },
            },
        ],
        profileImage: {
            type: String,
            default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
