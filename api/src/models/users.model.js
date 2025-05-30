const { createConnection } = require('../config/database');

const getConnection = async () => {
    return await createConnection();
};

const UserModel = {
    /**
     * Find a user by email.
     * @param {string} email
     * @returns {Promise<Object|null>}
     */
    async findByEmail(email) {
        const conn = await getConnection();
        const [rows] = await conn.execute(
            'SELECT * FROM users WHERE email = ? LIMIT 1',
            [email]
        );
        await conn.end();
        return rows.length ? rows[0] : null;
    },

    /**
     * Find a user by username.
     * @param {string} username
     * @returns {Promise<Object|null>}
     */
    async findByUsername(username) {
        const conn = await getConnection();
        const [rows] = await conn.execute(
            'SELECT * FROM users WHERE username = ? LIMIT 1',
            [username]
        );
        await conn.end();
        return rows.length ? rows[0] : null;
    },

    /**
     * Find a user by UUID.
     * @param {string} uuid
     * @returns {Promise<Object|null>}
     */
    async findByUuid(uuid) {
        const conn = await getConnection();
        const [rows] = await conn.execute(
            'SELECT * FROM users WHERE user_uuid = ? LIMIT 1',
            [uuid]
        );
        await conn.end();
        return rows.length ? rows[0] : null;
    },

    /**
     * Create a new user.
     * @param {Object} user
     * @param {string} user.user_uuid
     * @param {string} user.username
     * @param {string} user.email
     * @param {string} user.password - hashed password
     * @returns {Promise<void>}
     */
    async createUser({ user_uuid, username, email, password }) {
        const conn = await getConnection();
        await conn.execute(
            'INSERT INTO users (user_uuid, username, email, password) VALUES (?, ?, ?, ?)',
            [user_uuid, username, email, password]
        );
        await conn.end();
    },

    async updateUser({ user_uuid, username, email }) {
        const conn = await getConnection();
        const [result] = await conn.execute(
            'UPDATE users SET username = ?, email = ? WHERE user_uuid = ?',
            [username, email, user_uuid]
        );
        await conn.end();
        return result.affectedRows > 0;
    }
};

module.exports = UserModel;