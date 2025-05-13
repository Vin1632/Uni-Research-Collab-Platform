const pool = require('../db');

async function insert_proposals(user_id, title, description, link_image, start_date, end_date) {
   
    try {
        const [result] = await pool.query(
            `INSERT INTO Projects(user_id, title, description, link_image, start_date, end_date)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [user_id, title, description, link_image || null, start_date, end_date]
        );

        if (result.affectedRows > 0) {
            const [rows] = await pool.query("SELECT LAST_INSERT_ID() as project_id");
            return rows; 
        } else {
            throw new Error('Insert failed: No rows affected.');
        }
    } catch (error) {
        console.error("failed to insert into Project table in the database", error);
        throw error;
    }
}


async function insert_projectData(project_id, title, requirements, link_image, funds, funding_source, start_date, end_date) {
    try {
        const result = await pool.query("INSERT INTO ProjectData(project_id, title, requirements, link_image, funds, funding_source, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
            [project_id,title, requirements, link_image, funds, funding_source, start_date, end_date ]);
        return result;

    } catch (error) {
        console.error("Failed To insert into Projectdata", error);
        throw new Error(error);
    }
}


module.exports = {insert_proposals, insert_projectData}