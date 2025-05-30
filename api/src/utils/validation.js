const { validate: validateUuidV4 } = require('uuid');

/**
 * Validate if a string is a valid UUID v4.
 * @param {string} uuid - UUID string to validate.
 * @returns {boolean} True if valid UUID v4, false otherwise.
 */
function validateUuid(uuid) {
    return validateUuidV4(uuid);
}

/**
 * Validate the structure and types of a restaurant object.
 * @param {object} restaurant
 * @param {string} restaurant.name
 * @param {string} restaurant.address
 * @param {string} restaurant.phone
 * @returns {{ valid: boolean, message?: string }}
 */
function validateRestaurantData(restaurant) {
    if (!restaurant || typeof restaurant !== 'object') {
        return { valid: false, message: 'Restaurant data must be an object.' };
    }

    const { name, address, phone } = restaurant;

    if (!name || typeof name !== 'string') {
        return { valid: false, message: 'Invalid or missing "name".' };
    }
    if (!address || typeof address !== 'string') {
        return { valid: false, message: 'Invalid or missing "address".' };
    }
    if (!phone || typeof phone !== 'string') {
        return { valid: false, message: 'Invalid or missing "phone".' };
    }

    return { valid: true };
}

/**
 * Validate reservation data.
 * @param {object} reservation
 * @param {number} reservation.user_id
 * @param {number} reservation.restaurant_id
 * @param {string} reservation.reservation_datetime
 * @param {number} reservation.guests
 * @param {string} [reservation.status]
 * @returns {{ valid: boolean, message?: string }}
 */
function validateReservationData(reservation) {
    if (!reservation || typeof reservation !== 'object') {
        return { valid: false, message: 'Reservation data must be an object.' };
    }

    const { user_id, restaurant_id, reservation_datetime, guests, status } = reservation;

    if (!user_id || typeof user_id !== 'number') {
        return { valid: false, message: 'Invalid or missing "user_id".' };
    }
    if (!restaurant_id || typeof restaurant_id !== 'number') {
        return { valid: false, message: 'Invalid or missing "restaurant_id".' };
    }
    if (!reservation_datetime || typeof reservation_datetime !== 'string') {
        return { valid: false, message: 'Invalid or missing "reservation_datetime".' };
    }
    if (!guests || typeof guests !== 'number' || guests <= 0) {
        return { valid: false, message: '"guests" must be a positive number.' };
    }
    if (status && !['pending', 'confirmed', 'cancelled'].includes(status)) {
        return { valid: false, message: '"status" must be pending, confirmed, or cancelled.' };
    }

    return { valid: true };
}

/**
 * Very basic email format check (optional for registration).
 * @param {string} email
 * @returns {boolean}
 */
function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && emailRegex.test(email);
}

module.exports = {
    validateUuid,
    validateRestaurantData,
    validateReservationData,
    validateEmailFormat
};