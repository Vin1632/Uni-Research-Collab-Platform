// Routes/Invite_Routes.js
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();

// POST route to send invite
router.post('/send-invite', async (req, res) => {
  const { toEmail, fromUser, projectTitle } = req.body;

  if (!toEmail || !fromUser || !projectTitle) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const baseUrl = "https://uni-research-collab-fffwfkcnbdd5b9ct.southafricanorth-01.azurewebsites.net";
    const acceptLink = `${baseUrl}/api/invite/accept?project=${encodeURIComponent(projectTitle)}&email=${encodeURIComponent(toEmail)}`;
    const declineLink = `${baseUrl}/api/invite/decline?project=${encodeURIComponent(projectTitle)}&email=${encodeURIComponent(toEmail)}`;

    const mailOptions = {
      from: `"RE:HUB" <${process.env.MAIL_USER}>`,
      to: toEmail,
      subject: `You're invited to collaborate on "${projectTitle}"`,
      html: `
        <p>${fromUser} has invited you to collaborate on a research project titled <strong>${projectTitle}</strong>.</p>
        <p>
          <a href="${acceptLink}">Accept</a> |
          <a href="${declineLink}">Decline</a>
        </p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Invite sent successfully' });

  } catch (error) {
    console.error('Invite email error:', error);
    res.status(500).json({ message: 'Failed to send invite' });
  }
});

// GET route to handle Accept
router.get('/accept', (req, res) => {
  const { email, project } = req.query;

  if (!email || !project) {
    return res.status(400).send('Invalid invite link');
  }

  // TODO: Record invite acceptance in the database here
  console.log(`✅ Invite accepted by ${email} for project "${project}"`);

  // Redirect to login page
  res.redirect('/login');
});

// GET route to handle Decline
router.get('/decline', (req, res) => {
  const { email, project } = req.query;

  if (!email || !project) {
    return res.status(400).send('Invalid decline link');
  }

  // TODO: Record invite decline in the database here
  console.log(`❌ Invite declined by ${email} for project "${project}"`);

  // Redirect to login page
  res.redirect('/login');
});

module.exports = router;
