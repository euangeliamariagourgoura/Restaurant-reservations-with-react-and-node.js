const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('../models/users.model');
const { validateUuid } = require('../utils/validation');
const logger = require('../utils/logger');

/**
 * Register a new user with hashed password.
 */
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    try {
        // Check for existing user by username or email
        const existingUser = await UserModel.findByUsername(username) || await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user_uuid = uuidv4();

        await UserModel.createUser({ user_uuid, username, email, password: hashedPassword });

        return res.status(201).json({ message: 'User registered successfully', user_uuid });
    } catch (error) {
        logger.error('Error registering user:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

/**
 * Get a user by UUID.
 */
const getUserByUuid = async (req, res) => {
    const { id } = req.params;

    if (!validateUuid(id)) {
        return res.status(400).json({ message: 'Invalid UUID format.' });
    }

    try {
        const user = await UserModel.findByUuid(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Remove password from the response
        const { password, ...userData } = user;
        return res.status(200).json(userData);
    } catch (error) {
        logger.error('Error fetching user by UUID:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

const updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;

    if (!validateUuid(id)) {
        return res.status(400).json({ message: 'Invalid UUID format.' });
    }

    if (!username || !email) {
        return res.status(400).json({ message: 'Username and email are required.' });
    }

    try {
        const user = await UserModel.findByUuid(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await UserModel.updateUser({ user_uuid: id, username, email });

        return res.status(200).json({
            user_id: user.user_id,
            user_uuid: id,
            username,
            email
        });
    } catch (err) {
        logger.error('Error updating user:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    getUserByUuid,
    updateUserProfile
};
