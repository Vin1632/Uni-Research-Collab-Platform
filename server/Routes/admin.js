const db = require("../db");
const express = require('express');
const router = express.Router();
const { delete_project, get_flagged_projects, delete_flag } = require('../controllers/flagged_projects');

// GET all flagged projects
router.get('/flagged-projects', async (req, res) => {
  try {
    const flaggedProjects = await get_flagged_projects();
    res.json(flaggedProjects[0]);
  } catch (error) {
    console.error('Error fetching flagged projects:', error);
    res.status(500).json({ error: 'Failed to fetch flagged projects' });
  }
});

// DELETE a flagged project entry (unflag/delete flag)
router.delete('/flagged-projects/:flagId', async (req, res) => {
  const { flagId } = req.params;
  try {
    const result = await delete_flag(flagId);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Flag not found' });
    }
    res.json({ message: 'Flag deleted successfully' });
  } catch (error) {
    console.error('Error deleting flag:', error);
    res.status(500).json({ error: 'Failed to delete flag' });
  }
});

// DELETE a project by project ID
router.delete('/projects/:projectId', async (req, res) => {
  const { projectId } = req.params;
  try {
    const result = await delete_project(projectId);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// GET project details by project ID
router.get("/projects/:projectId", async (req, res) => {
  const { projectId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM projects WHERE project_id = ?",
      [projectId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching project details:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET all users
router.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

module.exports = router;
