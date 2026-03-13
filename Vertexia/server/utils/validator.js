const ErrorHandler = require('../utils/ErrorHandler');

const validateFields = (fields, next) => {
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            next(new ErrorHandler(`${key} is required`, 400));
            return false;
        }
    }
    return true;
};

const validateEmail = (email, next) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        next(new ErrorHandler('Please enter a valid email address', 400));
        return false;
    }
    return true;
};

module.exports = { validateFields, validateEmail };
