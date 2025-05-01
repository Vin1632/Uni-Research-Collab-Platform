const express = require('express');
const router = express.Router();
const { get_recom_proj, get_project_data } = require('../controllers/recommendation_projects');
const {insert_proposals, insert_projectData} = require('../controllers/proposals');

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

module.exports = router;