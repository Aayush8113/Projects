const User = require('../models/User');
const ErrorHandler = require('../utils/ErrorHandler');

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return next(new ErrorHandler('User not found', 404));
        const { password, ...otherDetails } = user._doc;
        res.status(200).json({ success: true, user: otherDetails });
    } catch (err) {
        next(err);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return next(new ErrorHandler('User not found', 404));

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        const { password, ...otherDetails } = updatedUser._doc;
        res.status(200).json({ success: true, user: otherDetails });
    } catch (err) {
        next(err);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, users });
    } catch (err) {
        next(err);
    }
};

module.exports = { getUser, updateUser, getAllUsers };
