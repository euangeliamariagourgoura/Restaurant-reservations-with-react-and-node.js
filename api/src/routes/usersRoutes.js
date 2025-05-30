const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { validateUUID } = require('../middlewares/validateUUID.middleware');

// Register a new user
router.post('/register', usersController.registerUser);

// Get user by UUID
router.get('/:id', validateUUID, usersController.getUserByUuid);

router.put('/:id', validateUUID, authenticateToken, usersController.updateUserProfile);

module.exports = router;