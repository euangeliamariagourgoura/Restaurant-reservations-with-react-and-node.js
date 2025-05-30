const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservationsController');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { validateUUID } = require('../middlewares/validateUUID.middleware');

// Public or admin access (you can restrict with token if needed)
router.get('/', reservationsController.getAllReservations);
router.get('/:id', validateUUID, reservationsController.getReservationById);

// Protected routes
router.post('/', authenticateToken, reservationsController.createReservation);
router.put('/:id', [authenticateToken, validateUUID], reservationsController.updateReservation);
router.delete('/:id', [authenticateToken, validateUUID], reservationsController.deleteReservation);

module.exports = router;