const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurantController');
const { authenticateToken } = require('../middlewares/auth.middleware');
const {validateUUID} = require("../middlewares/validateUUID.middleware");

// Public routes

router.get('/', restaurantController.getAllRestaurants);

router.get('/:id', restaurantController.getRestaurantById);

// Protected routes

router.post('/', authenticateToken, restaurantController.createRestaurant);

router.put('/:id', [authenticateToken, validateUUID], restaurantController.updateRestaurant);

router.delete('/:id', authenticateToken, restaurantController.deleteRestaurant);

module.exports = router;
