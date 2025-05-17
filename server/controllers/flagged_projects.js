const pool = require('../db');

// Flag a project
async function flag_project(project_id, flagged_by_user_id, reason, description) {
    try {
        const result = await pool.query(
            "INSERT INTO flagged_projects (project_id, flagged_by_user_id, reason, description) VALUES (?, ?, ?, ?)",
            [project_id, flagged_by_user_id, reason, description]
        );
        return result;
    } catch (error) {
        console.error("Failed to flag project", error);
        throw error;
    }
}

// Get all flagged projects (for admin)
async function get_flagged_projects() {
    try {
        const result = await pool.query(`
            SELECT f.flag_id, f.project_id, f.flagged_by_user_id, f.reason, f.description, f.flagged_at, p.title
            FROM flagged_projects f
            JOIN projects p ON f.project_id = p.project_id
            ORDER BY f.flagged_at DESC
        `);
        return result;
    } catch (error) {
        console.error("Failed to retrieve flagged projects", error);
        throw error;
    }
}

// Delete or unflag a flagged entry
async function delete_flag(flag_id) {
    try {
        const result = await pool.query("DELETE FROM flagged_projects WHERE flag_id = ?", [flag_id]);
        return result;
    } catch (error) {
        console.error("Failed to delete flag", error);
        throw error;
    }
}
async function delete_project(project_id) {
    try {
      const result = await pool.query(`DELETE p, pd FROM projects p JOIN projectdata pd ON pd.project_id = p.project_id WHERE p.project_id = ? `, [project_id]);
      return result;
    } catch (error) {
      console.error("Failed to delete project", error);
      throw error;
    }
}  

module.exports = {
    flag_project,
    get_flagged_projects,
    delete_flag, delete_project
};
