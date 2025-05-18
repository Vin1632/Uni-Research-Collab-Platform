const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();
const {
  handleAcceptInvite,
  handleDeclineInvite
} = require('../controllers/inviteController');

// Route to send email invite
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

    const acceptLink = `https://uni-research-collab-wits.azurewebsites.net/api/accept-invite?project=${encodeURIComponent(projectTitle)}&sender=${encodeURIComponent(fromUser)}&recipient=${encodeURIComponent(toEmail)}`;
    const declineLink = `https://uni-research-collab-wits.azurewebsites.net/api/decline-invite?project=${encodeURIComponent(projectTitle)}&sender=${encodeURIComponent(fromUser)}&recipient=${encodeURIComponent(toEmail)}`;

    const mailOptions = {
      from: `"RE:HUB" <${process.env.MAIL_USER}>`,
      replyTo: fromUser,
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

// Delegate DB logic to controller
router.get('/accept-invite', handleAcceptInvite);
router.get('/decline-invite', handleDeclineInvite);

module.exports = router;
