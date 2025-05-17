const express = require('express');
const router = express.Router();
const { get_recom_proj, get_project_data } = require('../controllers/recommendation_projects');
const {insert_proposals, insert_projectData} = require('../controllers/proposals');
const { flag_project, get_flagged_projects, delete_flag } = require('../controllers/flagged_projects');

//get all Projects Data
router.get('/recom-projects/:id', async (req, res) => {
    
    try {
        const data = await get_recom_proj(req.params.id);
        res.status(200).json(data);
        
    } catch (error) {
        res.status(500).json({error : "Failed to fetch projects"})
        
    }
});

//get all the project data
router.get('/projectdata/:id', async (req, res) => {

    try {
        const data = await get_project_data(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error : "failed to fetch projects Data"})
    }
});

//insert projects
router.post('/project', async (req, res) => {
    try {
        const {user_id, title, description, link_image, start_date, end_date} = req.body;
        //controller to insert into the database
        const data = await insert_proposals(user_id, title, description, link_image, start_date, end_date);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message : "Failed to post project"});
    }
});

//insert project data
router.post('/projectdata', async (req, res) => {
    try {
        const {project_id, title, requirements, link_image, funds, funding_source, start_date, end_date} = req.body;
        //controller to insert into the Project Data
        const data = await insert_projectData(project_id, title, requirements, link_image, funds, funding_source, start_date, end_date);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message : "Failed to post project data"});
    }
});
// Flag a project
router.post('/flag-project', async (req, res) => {
    const { project_id, flagged_by_user_id, reason, description } = req.body;
    try {
        const result = await flag_project(project_id, flagged_by_user_id, reason, description);
        res.status(201).json({ message: "Project flagged successfully", result });
    } catch (error) {
        res.status(500).json({ error: "Failed to flag project" });
    }
});

// Get all flagged projects (admin)
router.get('/flagged-projects', async (req, res) => {
    try {
        const result = await get_flagged_projects();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch flagged projects" });
    }
});

// Delete/unflag a specific flag
router.delete('/flagged-project/:flag_id', async (req, res) => {
    try {
        const result = await delete_flag(req.params.flag_id);
        res.status(200).json({ message: "Flag deleted/unflagged", result });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete flag" });
    }
});


module.exports = router;