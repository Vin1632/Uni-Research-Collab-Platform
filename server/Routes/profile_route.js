const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profile_controller');

// GET profile by email (query param)
router.get('/', async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await getProfile(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Failed to fetch profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT profile update
router.put('/', async (req, res) => {
  console.log("Received PUT body:", req.body); // 🔍 DEBUG LINE

  const { email, name, institution, qualification, interests } = req.body;

  if (!email) {
    console.log("Missing email in request body");
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    await updateProfile({ email, name, institution, qualification, interests });
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Failed to update profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
