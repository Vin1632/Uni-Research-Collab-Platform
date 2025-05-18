// Routes/Invite_Routes.js
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const {insert_invitations, get_email_project_id } = require('../controllers/invite_collab_controllers');
require('dotenv').config();

// POST route to send invite
router.post('/send-invite', async (req, res) => {
  const { toEmail, fromUser, projectTitle } = req.body;

  try {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"My Research Hub" <${process.env.MAIL_USER}>`,
      replyTo: fromUser,
      to: toEmail,
      subject: `You're invited to collaborate on "${projectTitle}"`,
      html: `
        <p>${fromUser} has invited you to collaborate on a research project titled <strong>${projectTitle}</strong>.</p>

      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Invite sent successfully' });
    //insert invitaions into the database
    await insert_invitations(toEmail, fromUser, projectTitle);

  } catch (error) {
    console.error('Invite email error:', error);
    res.status(500).json({ message: 'Failed to send invite' });
  }
});

router.get('/send-invite/:id', async (req, res) => {
  const project_id = req.params.id;
  try {
    const data = await get_email_project_id(project_id);
    res.status(200).json({result : data});
  } catch (error) {
    console.error("Failed to Fetch the email using ID");
    res.status(500).json({message : "Failed To Fetch the email"});
    
  }
  
})
module.exports = router;
