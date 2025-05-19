const pool = require('../db');

async function get_notifs(userId) {
  try {
    const sql = `
      SELECT
        sender.email AS sender_email,
        invitee.email AS collaborator_email,
        p.title AS project_title,
        c.project_id,
        c.invitation,
        c.added_at
      FROM Collaborators c
      JOIN Users sender ON sender.user_id = c.user_id
      JOIN Users invitee ON invitee.user_id = c.collaborator_id 
      LEFT JOIN Projects p ON p.project_id = c.project_id
      WHERE c.collaborator_id = ?              
      ORDER BY c.added_at DESC
    `;

    const [rows] = await pool.query(sql, [userId]);
    return rows;     
  } catch (err) {
    console.error('Failed to get notifications:', err);
    throw err;        
  }
}

async function get_project_by_id(projectId) {
  try {
    const sql =  `
      SELECT 
        pd.*, 
        p.description
      FROM ProjectData pd
      LEFT JOIN Projects p ON p.project_id = pd.project_id
      WHERE pd.project_id = ?
    `
  ;
    const [rows] = await pool.query(sql, [projectId]);

    if (rows.length === 0) throw new Error("Project not found");
    return rows[0];
  } catch (err) {
    console.error('Error fetching project:', err);
    throw err;
  }
}

async function respond_to_invitation(collaboratorId, projectId, action) {
  try {
  
    const sql = `
      UPDATE Collaborators 
      SET invitation = ?
      WHERE collaborator_id = ? AND project_id = ?
    `;
    const [result] = await pool.query(sql, [action, collaboratorId, projectId]);

    if (result.affectedRows === 0) {
      throw new Error('No matching invitation found');
    }

    return { message: `Invitation ${action}` };
  } catch (err) {
    console.error('Error responding to invitation:', err);
    throw err;
  }
}

module.exports = {
  get_notifs,
  get_project_by_id,
  respond_to_invitation
};

module.exports = { get_notifs, get_project_by_id, respond_to_invitation };