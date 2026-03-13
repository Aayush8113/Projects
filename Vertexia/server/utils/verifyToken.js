const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated!' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: 'Token is not valid!' });
        req.user = user;
        next();
    });
};

const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ success: false, message: 'You are not authorized!' });
        }
    });
};

const verifySeller = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'seller' || req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ success: false, message: 'Seller access required!' });
        }
    });
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ success: false, message: 'Admin access required!' });
        }
    });
};

module.exports = { verifyToken, verifyUser, verifySeller, verifyAdmin };
