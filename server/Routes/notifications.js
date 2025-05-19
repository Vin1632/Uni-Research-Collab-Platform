const express = require('express');
const router = express.Router();
const {get_notifs} =  require('../controllers/notification_controllers');
const {get_project_by_id}= require('../controllers/notification_controllers');
const { respond_to_invitation } = require('../controllers/notification_controllers');

//get all notifications 
router.get('/notification', async (req, res) => {
  const userId = req.query.userId;  // fetch from query string

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId query parameter' });
  }

  try {
    const notifications = await get_notifs(userId);
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.get('/projects/:projectId', async (req, res) => {
  const projectId = req.params.projectId;

  try {
    const project = await get_project_by_id(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
});

router.post('/respond', async (req, res) => {
  const { userId, projectId, action } = req.body;

  if (!userId || !projectId || !action) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const result = await respond_to_invitation(userId, projectId, action);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to process invitation' });
  }
});

module.exports = router;