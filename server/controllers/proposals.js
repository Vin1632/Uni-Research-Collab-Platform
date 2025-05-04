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

async function get_user_projects(userId) {
    const [rows] = await pool.query(
        `SELECT p.project_id, p.title,  p.description,  p.start_date, p.end_date, p.created_at,  pd.funds,  pd.funds_spent     
         FROM Projects p
         LEFT JOIN ProjectData pd ON pd.project_id = p.project_id
         WHERE p.user_id = ?
         ORDER BY p.created_at DESC`, 
        [userId]
    );
    return rows;
}


async function get_project_data(projectId) {
    const [rows] = await pool.query(
        `SELECT project_id, title, requirements, link_image, funds, funds_spent, funding_source, start_date, end_date 
         FROM ProjectData 
         WHERE project_id = ?`,
        [projectId]
    );
    return rows;
}



module.exports = {insert_proposals, insert_projectData, get_user_projects, get_project_data};