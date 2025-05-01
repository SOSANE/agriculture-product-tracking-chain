require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Type', 'Authorization']
}));


app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Database connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
});

pool.query('SELECT NOW()')
    .then(res => console.log('Database connected at:', res.rows[0].now))
    .catch(err => console.error('Database connection error:', err));


// Authentification route
app.post('/auth/:role', async (req, res) => {
    console.log('Auth request received:', req.body); // Debug log
    const { username, password } = req.body;
    const requestedRole = req.params.role;

    console.log('Login attempt:', { username, requestedRole }); // Debug log

    try {
        const result = await pool.query(
            'SELECT * FROM supplychain.auth WHERE username = $1 AND role = $2',
            [username, requestedRole]
        );

        console.log('DB query result:', result.rows); // Debug log

        if (result.rows.length === 0) {
            console.log('User not found'); // Debug
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = result.rows[0];
        console.log('Stored hash:', user.password); // Debug

        const match = await bcrypt.compare(password, user.password);
        console.log('Password match:', match); // Debug

        if (!match) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        req.session.user = {
            username: user.username,
            role: user.role
        };
        console.log('Session created:', req.session.user); // Debug log

        res.json({
            success: true,
            role: user.role,
            redirect: '/dashboard'
        });

    } catch (err) {
        console.error('Auth error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

app.get('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }

    try {
        const result = await pool.query(
            'SELECT a.username, a.role, p.name, p.email, p.organization, p.phone, p.address FROM supplychain.auth a LEFT JOIN supplychain.profile p ON a.username = p.username WHERE a.username = $1',
            [req.session.user.username]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Profile error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

app.get('/auth/verify-session', async (req, res) => {
    console.log('Session verification request received'); // Debug log
    if (!req.session.user) {
        console.log('No session user found'); // Debug log
        return res.status(401).json({ success: false, message: 'No active session'});
    }

    try {
        const result = await pool.query(
            'SELECT username, role FROM supplychain.auth WHERE username = $1',
            [req.session.user.username]
        );

        if (result.rows.length === 0) {
            console.log('User not found in database'); // Debug log
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        console.log('Session verified successfully'); // Debug log
        res.json({ success: true, user: result.rows[0]});
    } catch (err) {
        console.error('Session verification error:', err);
        res.status(500).json({ success: false, message: 'Server error'});
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});