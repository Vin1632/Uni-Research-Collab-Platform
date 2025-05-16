const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();
const { handleInvite } = require('../controllers/inviteController'); 

// Route to send email invite and insert into database
router.post('/send-invite', async (req, res) => {
  const { toEmail, fromUser, projectTitle } = req.body;

  if (!toEmail || !fromUser || !projectTitle) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    
    await handleInvite(req, res); 
      
    // Email process
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"RE:HUB" <${process.env.MAIL_USER}>`,
      replyTo: fromUser,
      to: toEmail,
      subject: `You're invited to collaborate on "${projectTitle}"`,
      html: `
        <p>${fromUser} has invited you to collaborate on a research project titled <strong>${projectTitle}</strong>.</p>
        <p>Click the link below to view the project and start collaborating:</p>
        <p><a href="https://uni-research-collab-wits.azurewebsites.net/">Go to RE:HUB</a></p>
      `
    };

    await transporter.sendMail(mailOptions); 
    res.status(200).json({ message: 'Invite sent and collaborator added successfully' });

  } catch (error) {
    console.error('Invite email error:', error);
    res.status(500).json({ message: 'Failed to send invite' });
  }
});

module.exports = router;
