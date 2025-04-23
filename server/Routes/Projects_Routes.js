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
        const data = await get_project_data(req.params.id)
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error : "failed to fetch projects Data"})
    }
});

//insert projects
router.post('/project', async (req, res) => {
    try {
        const {user_id, title, descripton, link_image} = req.body;
        const data = await insert_proposals(user_id, title, descripton, link_image);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error : "Failes to post project"});
    }
});

//insert project data
router.post('/projectdata', async (req, res) => {
    try {
        const {project_id, title, requirements, link_image, funding, funding_source} = req.body;
        const data = await insert_projectData(project_id, title, requirements, link_image, funding, funding_source);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error : "Failed to post project data"});
    }
});
module.exports = router;