const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');

// Get user profile with wallet balance
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            walletBalance: Number(user.walletBalance || 0)
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Failed to get user profile' });
    }
});

// Get wallet balance
router.get('/wallet', auth, async (req, res) => {
    try {
        // User is already attached by auth middleware
        res.json({
            balance: Number(req.user.walletBalance || 0)
        });
    } catch (error) {
        console.error('Get wallet error:', error);
        res.status(500).json({ message: 'Failed to get wallet balance' });
    }
});

module.exports = router; 