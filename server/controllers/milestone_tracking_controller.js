const pool = require('../db');

//Gets all the users projects
async function get_users_projects(id) {
    try {
        const result = await pool.query("SELECT * FROM projects WHERE user_id = ?", [id]);
        return result;
    } catch (error) {
        console.error('Failed to get projects', error);
        throw new Error(error);
    }
}

module.exports = {get_users_projects};