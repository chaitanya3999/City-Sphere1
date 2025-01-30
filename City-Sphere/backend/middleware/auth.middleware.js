const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Please login.'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            
            // Check if user still exists
            const user = await User.findById(decoded.userId).select('-password');
            if (!user) {
                res.clearCookie('token');
                return res.status(401).json({
                    success: false,
                    message: 'User not found. Please login again.'
                });
            }

            // Attach user to request
            req.user = user;
            next();
        } catch (error) {
            // If token is invalid or expired
            res.clearCookie('token');
            return res.status(401).json({
                success: false,
                message: 'Session expired. Please login again.'
            });
        }
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = authMiddleware;
