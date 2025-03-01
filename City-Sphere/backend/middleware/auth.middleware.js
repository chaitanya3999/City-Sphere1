const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = '311069610d1f6595da4c3d51d9e59c780c2e297bb2f53a213a9d6825a7d3cb0cb27f025f749e923ff0608ac941d1e5f9685e4311beb47fac299375c6f0ab974b';

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No valid Authorization header' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.userId) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Set both user and user._id for compatibility
        req.user = user;
        req.user.id = user._id;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = authMiddleware;
