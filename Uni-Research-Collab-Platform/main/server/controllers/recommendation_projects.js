const pool = require('../db');

//gets all the project the user--hasnt created.
async function get_recom_proj(id) {
    try {
        const result = await pool.query("SELECT * FROM projects WHERE user_id  != ?", [id]);
        return result;
    } catch (error) {
        console.error('Failed to get projects', error);
        throw new Error(error);
    }
}

async function get_project_data(id) {

    try {
        const result = await pool.query("SELECT * FROM projectdata where project_id = ? ", [id]);
        return result
        
    } catch (error) {
        console.error("failed to Fetch ProjectData", error);
        throw new Error(error);
        
    }
    
}


module.exports = {get_recom_proj, get_project_data};