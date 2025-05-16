const pool  = require('../db');

async function get_active_projects() {
  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.link_image AS project_image,
      pd.title AS detailed_title,
      pd.link_image,
      pd.requirements,
      pd.funds,
      pd.funding_source,
      pd.start_date,
      pd.end_date,
      (SELECT COUNT(*) FROM collaborators c WHERE c.project_id = p.project_id) AS collaborator_count,
      (SELECT name FROM Users u WHERE u.user_id = p.user_id) AS creator_name
    FROM projects p
    JOIN projectdata pd ON p.project_id = pd.project_id
    WHERE pd.end_date > CURDATE()
    ORDER BY pd.end_date ASC
  `;
  const [results] = await pool.query(query);
  return results;
}

async function donate_to_project({ reviewer_id, project_id, donated_amt }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insert into ReviewerInteractions
    await conn.query(
      `INSERT INTO ReviewerInteractions (reviewer_id, project_id, Donated_Amt) VALUES (?, ?, ?)`,
      [reviewer_id, project_id, donated_amt]
    );

    // Update ProjectData.funds_spent
    await conn.query(
      `UPDATE ProjectData SET funds = IFNULL(funds, 0) + ? WHERE project_id = ?`,
      [donated_amt, project_id]
    );

    await conn.commit();
    return { success: true, message: "Donation recorded successfully." };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

module.exports = {
  get_active_projects,
  donate_to_project,
};