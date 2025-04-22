
require('dotenv').config();
const mysql = require('mysql2/promise');

// Create a connection to the database using environment variables
const pool = mysql.createPool({
    host: 'urcp-server.mysql.database.azure.com',
    user: 'Laylow96',
    password: '@z4s74b8',
    database: 'urcp-database',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: true 
    }
});

module.exports = pool;

