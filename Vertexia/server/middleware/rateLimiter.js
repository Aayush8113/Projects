const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // Limit each IP to 10 requests per windowMs
    message: {
        success: false,
        message: 'Too many login attempts from this IP, please try again after 15 minutes'
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

const ticketLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 5, // Limit each IP to 5 tickets per hour
    message: {
        success: false,
        message: 'Too many support tickets created from this IP, please try again after an hour'
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

module.exports = { authLimiter, ticketLimiter };
