const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const usersRoutes = require('./usersRoutes');
const restaurantRoutes = require('./restaurantRoutes');
const reservationsRoutes = require('./reservationsRoutes');

// All routes are mounted under /api in app.js
router.use('/auth', authRoutes);               // POST /api/auth/login
router.use('/users', usersRoutes);             // POST /api/users/register, GET /api/users/:id
router.use('/restaurants', restaurantRoutes);  // Full CRUD for restaurants
router.use('/reservations', reservationsRoutes); // Full CRUD for reservations

module.exports = router;