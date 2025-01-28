const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_key_city_novas_2025';

// In-memory user storage (replace with a database in production)
const users = [];

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, 'src')));

// Specific routes for authentication
app.post('/api/signup', async (req, res) => {
    try {
        const { phoneEmail, password, name } = req.body;

        // Check if user already exists
        const existingUser = users.find(user => user.phoneEmail === phoneEmail);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = {
            id: users.length + 1,
            name,
            phoneEmail,
            password: hashedPassword,
            createdAt: new Date()
        };
        users.push(newUser);

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser.id, phoneEmail: newUser.phoneEmail }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            username: name,
            token,
            userDetails: {
                id: newUser.id,
                name: newUser.name,
                phoneEmail: newUser.phoneEmail
            }
        });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { phoneEmail, password } = req.body;

        // Find user
        const user = users.find(u => u.phoneEmail === phoneEmail);
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, phoneEmail: user.phoneEmail }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            username: user.name,
            token,
            userDetails: {
                id: user.id,
                name: user.name,
                phoneEmail: user.phoneEmail
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'html', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`City Novas Authentication Server running on http://localhost:${PORT}`);
});

// Export for testing or further use
module.exports = app;
