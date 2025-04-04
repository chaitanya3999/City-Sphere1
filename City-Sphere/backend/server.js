const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const walletRoutes = require('./routes/wallet.routes');
const restaurantRoutes = require('./routes/restaurantRoutes');

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://127.0.0.1:5501', 'http://localhost:5501'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the src directory
app.use('/src', express.static(path.join(__dirname, '../src'), {
    setHeaders: (res, filepath) => {
        // Set proper MIME types
        if (filepath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        if (filepath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
        if (filepath.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
        // Enable caching for static files
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
}));

// API routes with proper error handling
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/restaurants', restaurantRoutes);

// Serve HTML files
const HTML_FILES = [
    'index.html',
    'auth.html',
    'user-dashboard.html',
    'services.html',
    'aboutus.html',
    'contact.html',
    'wallet.html',
    'dashboard.html'
];

// Route handler for HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/html/index.html'));
});

// Handle all HTML file routes
HTML_FILES.forEach(file => {
    app.get(`/${file}`, (req, res) => {
        res.sendFile(path.join(__dirname, '../src/html', file));
    });
    // Also handle /src/html/ routes
    app.get(`/src/html/${file}`, (req, res) => {
        res.sendFile(path.join(__dirname, '../src/html', file));
    });
});

// Catch-all route for other HTML files in src/html
app.get('/src/html/:file', (req, res, next) => {
    const filePath = path.join(__dirname, '../src/html', req.params.file);
    res.sendFile(filePath, err => {
        if (err) {
            next();
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false,
        message: 'Internal server error',
        error: err.message 
    });
});

// Update the MongoDB connection part
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://TheFlash7x:Anurag270306*@cluster0.me6vv.mongodb.net/citysphere?retryWrites=true&w=majority";

// MongoDB Connection
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});