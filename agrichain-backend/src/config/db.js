require('dotenv').config();
const { Pool } = require('pg');

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

module.exports = {
    query: (text, params) => pool.query(text, params)
}