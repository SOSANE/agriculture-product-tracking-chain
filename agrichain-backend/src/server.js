require('dotenv').config();
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const userRoutes = require('./domains/user');
const productRoutes = require('./domains/product');

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Type', 'Authorization']
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Routes
app.use(userRoutes);
app.use(productRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Error when using middleware
app.use((req, res, next) => {
    res.status(500).send('Something went wrong during middleware');
});

module.exports = app;