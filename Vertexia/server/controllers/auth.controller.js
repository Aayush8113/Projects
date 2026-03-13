const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/ErrorHandler');

const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Default to buyer if no role or invalid role
        const assignedRole = ['buyer', 'seller'].includes(role) ? role : 'buyer';

        if (!name || !email || !password) {
            return next(new ErrorHandler('Please provide all fields', 400));
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErrorHandler('User with this email already exists', 400));
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: assignedRole,
        });

        await newUser.save();
        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password: reqPassword } = req.body;

        if (!email || !reqPassword) {
            return next(new ErrorHandler('Please provide email and password', 400));
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) return next(new ErrorHandler('Invalid email or password', 401));

        const isPasswordCorrect = await bcrypt.compare(reqPassword, user.password);
        if (!isPasswordCorrect)
            return next(new ErrorHandler('Invalid email or password', 401));

        if (user.status === 'suspended') {
            return res.status(403).json({ success: false, message: 'Your account has been suspended.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        const { password, ...otherDetails } = user._doc;

        res
            .cookie('access_token', token, {
                httpOnly: true,
            })
            .status(200)
            .json({ success: true, user: otherDetails });
    } catch (err) {
        next(err);
    }
};

const logout = (req, res) => {
    res
        .clearCookie('access_token')
        .status(200)
        .json({ success: true, message: 'Logged out successfully' });
};

module.exports = { register, login, logout };
