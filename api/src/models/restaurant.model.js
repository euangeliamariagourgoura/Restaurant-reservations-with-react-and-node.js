const { createConnection } = require('../config/database');

const getConnection = async () => {
    return await createConnection();
};

const RestaurantModel = {
    /**
     * Fetch all restaurants with optional pagination.
     * @param {number|null} limit
     * @param {number|null} offset
     * @returns {Promise<Array>}
     */
    async getAllRestaurants(limit = null, offset = null) {
        let query = 'SELECT * FROM restaurants';
        const params = [];

        if (limit !== null) {
            query += ' LIMIT ?';
            params.push(limit);
        }

        if (offset !== null && limit !== null) {
            query += ' OFFSET ?';
            params.push(offset);
        }

        const conn = await getConnection();
        const [rows] = await conn.execute(query, params);
        await conn.end();
        return rows;
    },

    /**
     * Get a restaurant by its UUID.
     * @param {string} uuid
     * @returns {Promise<Object|null>}
     */
    async getRestaurantById(uuid) {
        const conn = await getConnection();
        const [rows] = await conn.execute('SELECT * FROM restaurants WHERE restaurant_uuid = ?', [uuid]);
        await conn.end();
        return rows.length ? rows[0] : null;
    },

    /**
     * Create a new restaurant.
     * @param {Object} restaurantData
     * @param {string} restaurantData.restaurant_uuid
     * @param {string} restaurantData.name
     * @param {string} restaurantData.address
     * @param {string} restaurantData.phone
     * @returns {Promise<void>}
     */
    async createRestaurant({ restaurant_uuid, name, address, phone }) {
        const conn = await getConnection();
        await conn.execute(
            'INSERT INTO restaurants (restaurant_uuid, name, address, phone) VALUES (?, ?, ?, ?)',
            [restaurant_uuid, name, address, phone]
        );
        await conn.end();
    },

    /**
     * Update an existing restaurant.
     * @param {string} restaurant_uuid
     * @param {Object} restaurantData
     * @param {string} restaurantData.name
     * @param {string} restaurantData.address
     * @param {string} restaurantData.phone
     * @returns {Promise<boolean>} - True if updated, false if not found
     */
    async updateRestaurant(restaurant_uuid, { name, address, phone }) {
        const conn = await getConnection();
        const [result] = await conn.execute(
            'UPDATE restaurants SET name = ?, address = ?, phone = ? WHERE restaurant_uuid = ?',
            [name, address, phone, restaurant_uuid]
        );
        await conn.end();
        return result.affectedRows > 0;
    },

    /**
     * Delete a restaurant by UUID.
     * @param {string} restaurant_uuid
     * @returns {Promise<boolean>} - True if deleted, false if not found
     */
    async deleteRestaurant(restaurant_uuid) {
        const conn = await getConnection();
        const [result] = await conn.execute(
            'DELETE FROM restaurants WHERE restaurant_uuid = ?',
            [restaurant_uuid]
        );
        await conn.end();
        return result.affectedRows > 0;
    },

    /**
     * Check if a restaurant exists by UUID.
     * @param {string} restaurant_uuid
     * @returns {Promise<boolean>}
     */
    async restaurantExists(restaurant_uuid) {
        const conn = await getConnection();
        const [rows] = await conn.execute(
            'SELECT 1 FROM restaurants WHERE restaurant_uuid = ? LIMIT 1',
            [restaurant_uuid]
        );
        await conn.end();
        return rows.length > 0;
    }
};

module.exports = RestaurantModel;
