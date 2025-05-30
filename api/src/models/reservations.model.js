const { createConnection } = require('../config/database');

const getConnection = async () => {
    return await createConnection();
};

const ReservationModel = {
    /**
     * Get all reservations, optionally filtered by user or restaurant.
     * Returns each reservation with nested restaurant info.
     */
    async getAllReservations(filters = {}) {
        let query = `
            SELECT
                r.*,
                rest.restaurant_uuid,
                rest.name AS restaurant_name,
                rest.address AS restaurant_address,
                rest.phone AS restaurant_phone
            FROM reservations r
                     JOIN restaurants rest ON r.restaurant_id = rest.restaurant_id
            WHERE 1=1
        `;
        const params = [];

        if (filters.user_id) {
            query += ' AND r.user_id = ?';
            params.push(filters.user_id);
        }

        if (filters.restaurant_id) {
            query += ' AND r.restaurant_id = ?';
            params.push(filters.restaurant_id);
        }

        query += ' ORDER BY r.reservation_datetime DESC';

        const conn = await getConnection();
        const [rows] = await conn.execute(query, params);
        await conn.end();

        // ✅ Format the result to nest the restaurant info
        return rows.map(row => {
            const {
                restaurant_uuid,
                restaurant_name,
                restaurant_address,
                restaurant_phone,
                ...reservation
            } = row;

            return {
                ...reservation,
                restaurant: {
                    uuid: restaurant_uuid,
                    name: restaurant_name,
                    address: restaurant_address,
                    phone: restaurant_phone
                }
            };
        });
    },

    /**
     * Get reservation by UUID.
     * @param {string} uuid
     * @returns {Promise<Object|null>}
     */
    async getReservationByUuid(uuid) {
        const conn = await getConnection();
        const [rows] = await conn.execute(
            `
        SELECT 
            r.*,
            rest.restaurant_uuid,
            rest.name AS restaurant_name,
            rest.address AS restaurant_address,
            rest.phone AS restaurant_phone
        FROM reservations r
        JOIN restaurants rest ON r.restaurant_id = rest.restaurant_id
        WHERE r.reservation_uuid = ?
        LIMIT 1
        `,
            [uuid]
        );
        await conn.end();

        if (!rows.length) return null;

        const row = rows[0];
        const {
            restaurant_uuid,
            restaurant_name,
            restaurant_address,
            restaurant_phone,
            ...reservation
        } = row;

        return {
            ...reservation,
            restaurant: {
                uuid: restaurant_uuid,
                name: restaurant_name,
                address: restaurant_address,
                phone: restaurant_phone
            }
        };
    },

    /**
     * Create a new reservation.
     * @param {Object} reservation
     * @param {string} reservation.reservation_uuid
     * @param {number} reservation.user_id
     * @param {number} reservation.restaurant_id
     * @param {string} reservation.reservation_datetime - ISO format
     * @param {number} reservation.guests
     * @param {string} reservation.status - 'pending', 'confirmed', 'cancelled'
     * @returns {Promise<void>}
     */
    async createReservation({
                                reservation_uuid,
                                user_id,
                                restaurant_id,
                                reservation_datetime,
                                guests,
                                status = 'pending'
                            }) {
        const conn = await getConnection();
        await conn.execute(
            `INSERT INTO reservations (
                reservation_uuid, user_id, restaurant_id, reservation_datetime, guests, status
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [reservation_uuid, user_id, restaurant_id, reservation_datetime, guests, status]
        );
        await conn.end();
    },

    /**
     * Update an existing reservation.
     * @param {string} reservation_uuid
     * @param {Object} updates
     * @param {number} [updates.guests]
     * @param {string} [updates.status]
     * @param {string} [updates.reservation_datetime]
     * @returns {Promise<boolean>}
     */
    async updateReservation(reservation_uuid, updates) {
        const fields = [];
        const values = [];

        if (updates.guests !== undefined) {
            fields.push('guests = ?');
            values.push(updates.guests);
        }
        if (updates.status) {
            fields.push('status = ?');
            values.push(updates.status);
        }
        if (updates.reservation_datetime) {
            fields.push('reservation_datetime = ?');
            values.push(updates.reservation_datetime);
        }

        if (!fields.length) return false;

        values.push(reservation_uuid);
        const query = `UPDATE reservations SET ${fields.join(', ')} WHERE reservation_uuid = ?`;

        const conn = await getConnection();
        const [result] = await conn.execute(query, values);
        await conn.end();
        return result.affectedRows > 0;
    },

    /**
     * Delete a reservation by UUID.
     * @param {string} reservation_uuid
     * @returns {Promise<boolean>}
     */
    async deleteReservation(reservation_uuid) {
        const conn = await getConnection();
        const [result] = await conn.execute(
            'DELETE FROM reservations WHERE reservation_uuid = ?',
            [reservation_uuid]
        );
        await conn.end();
        return result.affectedRows > 0;
    }
};

module.exports = ReservationModel;