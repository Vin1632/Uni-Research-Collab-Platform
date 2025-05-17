const express = require('express');
const router = express.Router();
const {get_notifs} =  require('../controllers/notification_controllers');

//get all notifications ,not sure from where yet!
router.get('/notification', async (req, res) => {

    try {
        const data = await get_users_projects(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error : "failed to fetch projects Data"})
    }
});


module.exports = router;