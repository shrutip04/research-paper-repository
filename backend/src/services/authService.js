const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const registerUser = async (userData) => {
    const {
        name,
        email,
        password,
        role
    } = userData;

    const passwordHash = await bcrypt.hash(password, 10);

    const query = `
        INSERT INTO users (
            name,
            email,
            password_hash,
            role
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            user_id,
            name,
            email,
            role,
            created_at;
    `;

    const result = await pool.query(query, [
        name,
        email,
        passwordHash,
        role
    ]);

    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT
            user_id,
            name,
            email,
            password_hash,
            role,
            created_at
        FROM users
        WHERE email = $1;
    `;

    const result = await pool.query(query, [email]);

    return result.rows[0] || null;
};

const getUserById = async (userId) => {
    const query = `
        SELECT
            user_id,
            name,
            email,
            role,
            created_at
        FROM users
        WHERE user_id = $1;
    `;

    const result = await pool.query(query, [userId]);

    return result.rows[0] || null;
};

module.exports = {
    registerUser,
    findUserByEmail,
    getUserById
};