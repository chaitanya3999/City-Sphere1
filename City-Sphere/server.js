const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, 'src')));

// Database Connection
const dbPath = path.resolve(__dirname, 'city_sphere.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the City Sphere database.');
        initializeDatabase();
    }
});

// Secret key for JWT
const JWT_SECRET = 'your_super_secret_key_city_sphere_2025';

// Initialize Database Schema
function initializeDatabase() {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        workplace TEXT,
        services TEXT,
        profile_picture TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // User Preferences Table
    db.run(`CREATE TABLE IF NOT EXISTS user_preferences (
        user_id INTEGER PRIMARY KEY,
        transport_preferences TEXT,
        city_interests TEXT,
        family_members TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Services Table
    db.run(`CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        description TEXT,
        availability TEXT
    )`);
}

// Root route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'html', 'index.html'));
});

// Authentication Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// User Registration
app.post('/api/signup', async (req, res) => {
    try {
        const { 
            name, 
            email, 
            password, 
            phone, 
            address, 
            workplace, 
            services,
            profilePicture 
        } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const insertUserQuery = `
            INSERT INTO users 
            (name, email, password, phone, address, workplace, services, profile_picture) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(insertUserQuery, [
            name, 
            email, 
            hashedPassword, 
            phone, 
            address, 
            workplace, 
            JSON.stringify(services || []),
            profilePicture || null
        ], function(err) {
            if (err) {
                return res.status(400).json({ 
                    error: err.message.includes('UNIQUE constraint failed') 
                        ? 'Email already exists' 
                        : 'Registration failed' 
                });
            }

            // Generate JWT
            const token = jwt.sign(
                { id: this.lastID, email }, 
                JWT_SECRET, 
                { expiresIn: '24h' }
            );

            res.status(201).json({ 
                message: 'User registered successfully', 
                userId: this.lastID,
                token 
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// User Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({ 
            message: 'Login successful', 
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profilePicture: user.profile_picture
            }
        });
    });
});

// Get User Profile
app.get('/api/profile', authenticateToken, (req, res) => {
    db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Remove sensitive information
        const { password, ...safeUser } = user;
        res.json(safeUser);
    });
});

// Update User Profile
app.put('/api/profile', authenticateToken, (req, res) => {
    const { name, phone, address, workplace, services } = req.body;

    const updateQuery = `
        UPDATE users 
        SET name = ?, phone = ?, address = ?, workplace = ?, services = ?
        WHERE id = ?
    `;

    db.run(
        updateQuery, 
        [
            name, 
            phone, 
            address, 
            workplace, 
            JSON.stringify(services || []), 
            req.user.id
        ], 
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Update failed' });
            }

            res.json({ message: 'Profile updated successfully' });
        }
    );
});

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'html', 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`City Sphere Backend running on port ${PORT}`);
    console.log(`Access the app at: http://localhost:${PORT}`);
});
