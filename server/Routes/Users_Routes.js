const express = require('express');
const router = express.Router();
const { insert_Users, get_User_By_Email } = require('../controllers/Users');

// GET endpoint to fetch User
router.post('/user', async (req, res) => {
    try {
        const email = req.body;
        const data = await get_User_By_Email(email);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data (User)' });
    }
});

// POST endpoint to add a new  User
router.post('/login', async (req, res) => {
    try {
        const { name, email, role, institution, qualification, interests } = req.body;
        await insert_Users(name, email, role, institution, qualification, interests);
        res.status(200).json({ message: 'User Added Successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add a User' });
    }
});

module.exports = router;