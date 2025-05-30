const { v4: uuidv4 } = require('uuid');
const RestaurantModel = require('../models/restaurant.model');
const { validateRestaurantData, validateUuid } = require('../utils/validation');
const logger = require('../utils/logger');

/**
 * Get all restaurants with optional pagination.
 */
const getAllRestaurants = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : null;

        if ((limit && isNaN(limit)) || (offset && isNaN(offset))) {
            return res.status(400).json({ message: 'Limit and offset must be valid integers.' });
        }

        const restaurants = await RestaurantModel.getAllRestaurants(limit, offset);
        return res.status(200).json(restaurants);
    } catch (error) {
        logger.error('Error fetching restaurants:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

/**
 * Get a single restaurant by UUID.
 */
const getRestaurantById = async (req, res) => {
    const { id } = req.params;

    if (!validateUuid(id)) {
        return res.status(400).json({ message: 'Invalid UUID format.' });
    }

    try {
        const restaurant = await RestaurantModel.getRestaurantById(id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        return res.status(200).json(restaurant);
    } catch (error) {
        logger.error('Error fetching restaurant by ID:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

/**
 * Create a new restaurant.
 */
const createRestaurant = async (req, res) => {
    const validation = validateRestaurantData(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    const restaurant_uuid = uuidv4();
    const { name, address, phone } = req.body;

    try {
        await RestaurantModel.createRestaurant({ restaurant_uuid, name, address, phone });
        return res.status(201).json({ restaurant_uuid, name, address, phone });
    } catch (error) {
        logger.error('Error creating restaurant:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

/**
 * Update an existing restaurant.
 */
const updateRestaurant = async (req, res) => {
    const { id } = req.params;

    if (!validateUuid(id)) {
        return res.status(400).json({ message: 'Invalid UUID format.' });
    }

    const validation = validateRestaurantData(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        const updated = await RestaurantModel.updateRestaurant(id, req.body);

        if (!updated) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        return res.status(200).json({ message: 'Restaurant updated successfully.' });
    } catch (error) {
        logger.error('Error updating restaurant:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

/**
 * Delete a restaurant by UUID.
 */
const deleteRestaurant = async (req, res) => {
    const { id } = req.params;

    if (!validateUuid(id)) {
        return res.status(400).json({ message: 'Invalid UUID format.' });
    }

    try {
        const deleted = await RestaurantModel.deleteRestaurant(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        return res.status(204).send();
    } catch (error) {
        logger.error('Error deleting restaurant:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
};