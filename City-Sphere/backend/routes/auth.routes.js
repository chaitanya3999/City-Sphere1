const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');
const router = express.Router();
const bcrypt = require('bcryptjs');
const JWT_SECRET = '311069610d1f6595da4c3d51d9e59c780c2e297bb2f53a213a9d6825a7d3cb0cb27f025f749e923ff0608ac941d1e5f9685e4311beb47fac299375c6f0ab974b';

// Initialize Google OAuth client
const googleClient = new OAuth2Client('855437139826-iuond0b1id6a7tuh2vlh9bv69kh88r6a.apps.googleusercontent.com');

// Cookie options
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
};

// Register new user
router.post('/register', async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ 
                success: false,
                message: 'Email already registered' 
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user
        await user.save();
        console.log('New user created:', email);

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || '311069610d1f6595da4c3d51d9e59c780c2e297bb2f53a213a9d6825a7d3cb0cb27f025f749e923ff0608ac941d1e5f9685e4311beb47fac299375c6f0ab974b',
            { expiresIn: '24h' }
        );

        // Set cookie
        res.cookie('token', token, COOKIE_OPTIONS);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                walletBalance: user.walletBalance || 0
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

// Google Sign-In
router.post('/google', async (req, res) => {
    try {
        console.log('Google sign-in request received:', req.body);
        const { token } = req.body;

        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: '855437139826-iuond0b1id6a7tuh2vlh9bv69kh88r6a.apps.googleusercontent.com'
        });

        const payload = ticket.getPayload();
        console.log('Google token payload:', payload);

        // Extract user data
        const { name, email, picture } = payload;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if doesn't exist
            user = new User({
                name,
                email,
                picture,
                password: Math.random().toString(36).slice(-8), // Generate random password
                authProvider: 'google'
            });
            await user.save();
            console.log('New Google user created:', email);
        }

        // Generate JWT token
        const jwtToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Set cookie
        res.cookie('token', jwtToken, COOKIE_OPTIONS);

        res.json({
            success: true,
            message: 'Google sign-in successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture
            },
            token: jwtToken
        });
    } catch (error) {
        console.error('Google sign-in error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Google sign-in failed'
        });
    }
});

// Logout user
router.post('/logout', (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
});

// Check authentication status
router.get('/check', auth, (req, res) => {
    res.json({
        success: true,
        authenticated: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
    });
});

module.exports = router;
