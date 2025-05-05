const express = require('express');
const router = express.Router();
const {get_users_projects} =  require('../controllers/milestone_tracking_controller');

//get all the project data
router.get('/projectdata/:id', async (req, res) => {

    try {
        const data = await get_users_projects(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error : "failed to fetch projects Data"})
    }
});

module.exports = router;