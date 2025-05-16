const express = require('express');
const router = express.Router();
const { get_recom_proj, get_project_data } = require('../controllers/recommendation_projects');
const {insert_proposals, insert_projectData} = require('../controllers/proposals');
const { get_active_projects, donate_to_project } = require('../controllers/reviews');
const { pool } = require('../db');

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

//get all projects that haven't reached their end_date
router.get('/active-projects', async (req, res) => {
  try {
    const results = await get_active_projects();
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching active projects:', error);
    res.status(500).json({ message: 'Failed to fetch active projects' });
  }
});

//insert into the ReviewerInteractions table
//update the funds_spent in the ProjectData table

router.post('/donate', async (req, res) => {
  try {
    const { reviewer_id, project_id, donated_amt } = req.body;
    if (!reviewer_id || !project_id || !donated_amt) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    const result = await donate_to_project({ reviewer_id, project_id, donated_amt });
    res.status(200).json(result);
  } catch (error) {
    console.error('Donation error:', error);
    res.status(500).json({ message: 'Failed to process donation.' });
  }
});

module.exports = router;