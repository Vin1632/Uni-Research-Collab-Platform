const pool = require('../db');

//gets all the project the user--hasnt created.
async function get_recom_proj(id) {
    try {
        const result = await pool.query(`SELECT * FROM projects p WHERE p.user_id != ? AND p.end_date < CURRENT_DATE AND NOT EXISTS ( SELECT 1 FROM flagged_projects fp WHERE fp.project_id = p.project_id )`, [id]);
        return result;
    } catch (error) {
        console.error('Failed to get projects', error);
        throw error;
    }
}

async function get_project_data(id) {

    try {
        const queryResult = await pool.query("SELECT * FROM projectdata where project_id = ? ", [id]);
        const result = queryResult[0] || [];
    return result.length ? result : [];
    } catch (error) {
        console.error("failed to Fetch ProjectData", error);
        throw error;
        
    }
    
}


module.exports = {get_recom_proj, get_project_data};