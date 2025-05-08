const db = require('../../config/db');

const UserModel = {
    async findByUsername(username) {
        const { rows } = await db.query('SELECT * FROM supplychain.auth a LEFT JOIN supplychain.profile p ON a.username = p.username WHERE a.username = $1', [username]);
        return rows.length > 0 ? rows[0] : null;
    },

    async findByEmail(email) {
        const { rows } = await db.query('SELECT * FROM supplychain.auth a LEFT JOIN supplychain.profile p ON a.username = p.username WHERE email = $1', [email]);
        return rows.length > 0 ? rows[0] : null;
    },

    async existByUsername(username) {
        const { rows } = await db.query('SELECT username FROM supplychain.auth WHERE username = $1', [username]);
        return rows.length > 0;
    },

    async createUser(username, name, password, role, organization, email, phone, address) {
        const query = `
        WITH auth_insert AS (
            INSERT INTO supplychain.auth(username, password, role) 
            VALUES ($1, $2, $3)
            RETURNING username
        )
        INSERT INTO supplychain.profile(username, name, organization, email, phone, address)
        SELECT $1, $4, $5, $6, $7, $8
        FROM auth_insert
        RETURNING *;
        `;

        const values = [username, password, role, name, organization, email, phone, address];

        const { rows } = await db.query(query, values);
        return rows.length > 0 ? rows[0] : null;
    },

    async updateUser(username, name, role, organization, email, phone, address) {
        const query = `
        WITH auth_update AS (
            UPDATE supplychain.auth(username, role) 
            VALUES ($1, $2)
            RETURNING username
        )
        UPDATE supplychain.profile(username, name, organization, email, phone, address)
        SELECT $1, $3, $4, $5, $6, $7
        FROM auth_update
        RETURNING *;
        `;

        const values = [username, role, name, organization, email, phone, address];
        const { rows } = await db.query(query, values);
        return rows.length > 0 ? rows[0] : null;
    },

    async getAllUsers() {
        const { rows } = await db.query('SELECT * FROM supplychain.auth a LEFT JOIN supplychain.profile p ON a.username = p.username');
        return rows.length > 0 ? rows : null;
    }
}

module.exports = UserModel;