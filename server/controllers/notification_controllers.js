const pool = require('../db');

async function get_notifs(id) {
    try {
        const result = await pool.query( `
      SELECT 
        u1.email AS sender_email,
        u2.email AS collaborator_email,
        p.project_name,
        c.invitation,
        c.added_at
      FROM Collaborators c
      JOIN Users u1 ON u1.user_id = c.user_id
      JOIN Users u2 ON u2.user_id = c.collaborator_id
      JOIN Projects p ON p.project_id = c.project_id
      ORDER BY c.added_at DESC
    `, [id]);
        return result;
    } catch (error) {
        console.error('Failed to get projects', error);
        throw new Error(error);
    }
}

module.exports = {get_notifs};