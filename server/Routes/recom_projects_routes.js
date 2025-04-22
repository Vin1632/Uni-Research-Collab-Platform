const express = require('express');
const router = express.Router();
const { get_recom_proj } = require('../controllers/recommendation_projects');

//get all Projects Data

router.get('/recom-projects', async (req, res) => {
    
    try {
        const data = await get_recom_proj();
        res.status(200).json(data);
        
    } catch (error) {
        res.status(500).json({error : "Failed to fetch data"})
        
    }
})

module.exports = router;