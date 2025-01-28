const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
const https = require('https');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// SSL Certificate options
const options = {
    key: fs.readFileSync(path.join(__dirname, 'certificates', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certificates', 'cert.pem'))
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'city_sphere_session_secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

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
    const createUserTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            profile_picture TEXT,
            phone TEXT,
            address TEXT,
            workplace TEXT,
            services TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.run(createUserTableQuery);

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

// Add user details update route
app.post('/api/user/details', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // From authentication middleware
    const { phone, address, workplace, services } = req.body;

    // Validate input (optional but recommended)
    const updateData = {};
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (workplace) updateData.workplace = workplace;
    if (services && services.length > 0) updateData.services = services;

    // Update user details in the database
    const updateQuery = `
        UPDATE users 
        SET phone = ?, address = ?, workplace = ?, services = ?
        WHERE id = ?
    `;

    db.run(
        updateQuery, 
        [
            updateData.phone, 
            updateData.address, 
            updateData.workplace, 
            JSON.stringify(updateData.services || []), 
            userId
        ], 
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (this.changes === 1) {
                res.status(200).json({ message: 'User details updated successfully' });
            } else {
                res.status(404).json({ message: 'User not found or no changes made' });
            }
        }
    );
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Passport configuration
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
        done(err, user);
    });
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user exists
        db.get('SELECT * FROM users WHERE email = ?', [profile.emails[0].value], async (err, user) => {
            if (err) {
                return done(err);
            }
            
            if (user) {
                return done(null, user);
            }
            
            // Create new user
            const newUser = {
                name: profile.displayName,
                email: profile.emails[0].value,
                password: await bcrypt.hash(Math.random().toString(36), 10),
                profile_picture: profile.photos[0].value
            };
            
            db.run('INSERT INTO users (name, email, password, profile_picture) VALUES (?, ?, ?, ?)',
                [newUser.name, newUser.email, newUser.password, newUser.profile_picture],
                function(err) {
                    if (err) {
                        return done(err);
                    }
                    newUser.id = this.lastID;
                    return done(null, newUser);
                }
            );
        });
    } catch (error) {
        return done(error);
    }
}));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user exists
        db.get('SELECT * FROM users WHERE email = ?', [profile.emails[0].value], async (err, user) => {
            if (err) {
                return done(err);
            }
            
            if (user) {
                return done(null, user);
            }
            
            // Create new user
            const newUser = {
                name: profile.displayName,
                email: profile.emails[0].value,
                password: await bcrypt.hash(Math.random().toString(36), 10),
                profile_picture: profile.photos[0].value
            };
            
            db.run('INSERT INTO users (name, email, password, profile_picture) VALUES (?, ?, ?, ?)',
                [newUser.name, newUser.email, newUser.password, newUser.profile_picture],
                function(err) {
                    if (err) {
                        return done(err);
                    }
                    newUser.id = this.lastID;
                    return done(null, newUser);
                }
            );
        });
    } catch (error) {
        return done(error);
    }
}));

// OAuth Routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const token = jwt.sign({ id: req.user.id }, JWT_SECRET);
        res.redirect(`/user-dashboard.html?token=${token}`);
    }
);

app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        const token = jwt.sign({ id: req.user.id }, JWT_SECRET);
        res.redirect(`/user-dashboard.html?token=${token}`);
    }
);

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'html', 'index.html'));
});

// Start Server
https.createServer(options, app).listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});
