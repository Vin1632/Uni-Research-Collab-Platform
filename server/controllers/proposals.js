const pool = require('../db');

async function insert_proposals(user_id, title, description, link_image) {
    try {
        const result = await pool.query("INSERT INTO Projects(user_id, title, description, link_image) VALUES (?, ?, ?, ?)", [user_id,title, description, link_image])
        return result;
    } catch (error) {
        console.error("failed to insert into Project table in the database", error);
        throw new Error(error);
    }
    
}

async function insert_projectData(project_id, title, requirements, link_image, funds, funding_source) {
    try {
        const result = await pool.query("INSERT INTO ProjectData(project_id, title, requirements, link_image, funds, funding_source) VALUES (?, ?, ?, ?, ?, ?)", 
            [project_id,title, requirements, link_image, funds, funding_source ]);
        return result;

    } catch (error) {
        console.error("Failed To insert into Projectdata", error);
        throw new Error(error);
    }
}

async function get_project_id(user_id) {

    try {
        const result = await pool.query("SELECT project_id FROM Projects WHERE user_id = ?", [user_id]);
        return result;
    } catch (error) {
        console.error("failed to Fetch project_Id from database", error);
        throw new Error(error);
    }
    
}

module.exports = {insert_proposals, insert_projectData, get_project_id}