require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function hashAndUpdatePasswords() {
    // Get all users with temporary passwords
    const users = await pool.query('SELECT username, password, role FROM supplychain.auth');

    // Hash and update each password
    for (const user of users.rows) {
        let plainPassword;
        switch(user.username) {
            case 'admin': plainPassword = 'admin123'; break;
            case 'farmer1': plainPassword = 'password123'; break;
            case 'regulator1': plainPassword = 'securepass'; break;
            case 'processor1': plainPassword = 'process123'; break;
            case 'distributor1': plainPassword = 'distribute123'; break;
            case 'retailer1': plainPassword = 'retail123'; break;
            default: plainPassword = 'defaultPassword';
        }

        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        await pool.query(
            'UPDATE supplychain.auth SET password = $1 WHERE username = $2',
            [hashedPassword, user.username]
        );
        console.log(`Updated password for ${user.username}`);
    }

    console.log('All passwords hashed and updated successfully!');
    process.exit(0);
}

hashAndUpdatePasswords().catch(err => {
    console.error('Error hashing passwords:', err);
    process.exit(1);
});