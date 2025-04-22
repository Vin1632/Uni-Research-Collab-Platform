const pool = require('../db');

async function get_recom_proj() {
    try {
        const result = pool.query("SELECT * FROM ProjectData");
        return result;
    } catch (error) {
        console.error('Failed to get projects', error);
        throw new Error(error);
    }
}

module.exports = {get_recom_proj};