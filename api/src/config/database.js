const mysql = require('mysql2/promise');
const config = require('./index');

const createConnection = async () => {
    return mysql.createConnection({
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database
    });
};

module.exports = {
    createConnection
};
