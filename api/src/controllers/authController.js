const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/users.model');
const { secret, options } = require('../config/jwt');
const logger = require('../utils/logger');

/**
 * Login with email or username and password.
 * Returns JWT access token if credentials are valid.
 */
const login = async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ message: 'Identifier and password are required.' });
    }

    try {
        // Identifier can be either email or username
        const user = await UserModel.findByEmail(identifier) || await UserModel.findByUsername(identifier);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Create payload for JWT (you can include more fields if needed)
        const payload = {
            user_id: user.user_id,
            username: user.username,
            user_uuid: user.user_uuid
        };

        const accessToken = jwt.sign(payload, secret, options);

        return res.status(200).json({
            message: 'Login successful',
            accessToken,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                user_uuid: user.user_uuid
            }
        });
    } catch (error) {
        logger.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = {
    login
};