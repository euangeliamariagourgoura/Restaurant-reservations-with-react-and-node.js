const { v4: uuidv4 } = require('uuid');
const ReservationModel = require('../models/reservations.model');
const { validateUuid, validateReservationData } = require('../utils/validation');
const logger = require('../utils/logger');

/**
 * Get all reservations (optionally filtered by user_id or restaurant_id).
 */
const getAllReservations = async (req, res) => {
    try {
        const { user_id, restaurant_id } = req.query;
        const filters = {};

        if (user_id && /^\d+$/.test(user_id)) {
            filters.user_id = parseInt(user_id, 10);
        }

        if (restaurant_id && /^\d+$/.test(restaurant_id)) {
            filters.restaurant_id = parseInt(restaurant_id, 10);
        }

        const reservations = await ReservationModel.getAllReservations(filters);
        return res.status(200).json(reservations);
    } catch (error) {
        logger.error('Error fetching reservations:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

/**
 * Get a single reservation by UUID.
 */
const getReservationById = async (req, res) => {
    const { id } = req.params;

    if (!validateUuid(id)) {
        return res.status(400).json({ message: 'Invalid UUID format.' });
    }

    try {
        const reservation = await ReservationModel.getReservationByUuid(id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found.' });
        }

        return res.status(200).json(reservation);
    } catch (error) {
        logger.error('Error fetching reservation by ID:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

/**
 * Create a new reservation.
 */
const createReservation = async (req, res) => {
    const validation = validateReservationData(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    const { user_id, restaurant_id, reservation_datetime, guests, status } = req.body;
    const reservation_uuid = uuidv4();

    try {
        await ReservationModel.createReservation({
            reservation_uuid,
            user_id,
            restaurant_id,
            reservation_datetime,
            guests,
            status: status || 'pending'
        });

        return res.status(201).json({
            message: 'Reservation created successfully',
            reservation_uuid
        });
    } catch (error) {
        logger.error('Error creating reservation:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

/**
 * Update an existing reservation by UUID.
 */
const updateReservation = async (req, res) => {
    const { id } = req.params;

    if (!validateUuid(id)) {
        return res.status(400).json({ message: 'Invalid UUID format.' });
    }

    const updates = req.body;

    try {
        const success = await ReservationModel.updateReservation(id, updates);
        if (!success) {
            return res.status(404).json({ message: 'Reservation not found or no changes applied.' });
        }

        return res.status(200).json({ message: 'Reservation updated successfully.' });
    } catch (error) {
        logger.error('Error updating reservation:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

/**
 * Delete a reservation by UUID.
 */
const deleteReservation = async (req, res) => {
    const { id } = req.params;

    if (!validateUuid(id)) {
        return res.status(400).json({ message: 'Invalid UUID format.' });
    }

    try {
        const success = await ReservationModel.deleteReservation(id);
        if (!success) {
            return res.status(404).json({ message: 'Reservation not found.' });
        }

        return res.status(204).send();
    } catch (error) {
        logger.error('Error deleting reservation:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = {
    getAllReservations,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation
};