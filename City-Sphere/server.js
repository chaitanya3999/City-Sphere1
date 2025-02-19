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

    // Doctors Table
    db.run(`CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        specialization TEXT NOT NULL,
        qualifications TEXT NOT NULL,
        experience INTEGER NOT NULL,
        address TEXT NOT NULL,
        waiting_time TEXT NOT NULL,
        fee INTEGER NOT NULL
    )`);

    // Appointments Table
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        doctor_id INTEGER NOT NULL,
        patient_id INTEGER NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY(doctor_id) REFERENCES doctors(id),
        FOREIGN KEY(patient_id) REFERENCES users(id)
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

// Doctors Routes
app.get('/api/doctors', (req, res) => {
    const { search, specialty } = req.query;
    let sql = 'SELECT * FROM doctors WHERE 1=1';
    const params = [];

    if (search) {
        sql += ` AND (name LIKE ? OR specialization LIKE ? OR address LIKE ?)`;
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
    }

    if (specialty && specialty !== 'all doctors') {
        sql += ` AND LOWER(specialization) = LOWER(?)`;
        params.push(specialty.replace('s', '')); // Remove plural 's' from specialty
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Book Appointment
app.post('/api/appointments', authenticateToken, (req, res) => {
    const { doctorId, date, time } = req.body;
    const patientId = req.user.id;
    
    const sql = `INSERT INTO appointments (doctor_id, patient_id, appointment_date, appointment_time, status)
                 VALUES (?, ?, ?, ?, 'pending')`;
    
    db.run(sql, [doctorId, patientId, date, time], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Appointment booked successfully',
            appointmentId: this.lastID
        });
    });
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
