
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const db = require('../db');
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

    const acceptLink = `https://uni-research-collab-fffwfkcnbdd5b9ct.southafricanorth-01.azurewebsites.net/api/accept-invite?project=${encodeURIComponent(projectTitle)}&sender=${encodeURIComponent(fromUser)}&recipient=${encodeURIComponent(toEmail)}`;
    const declineLink = `https://uni-research-collab-fffwfkcnbdd5b9ct.southafricanorth-01.azurewebsites.net/api/decline-invite?project=${encodeURIComponent(projectTitle)}&sender=${encodeURIComponent(fromUser)}&recipient=${encodeURIComponent(toEmail)}`;

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

// GET route to handle Accept
router.get('/accept-invite', async (req, res) => {
  const { project, sender, recipient } = req.query;

  if (!project || !sender || !recipient) {
    return res.status(400).send('Missing required parameters.');
  }

  try {
    // 1. Get user_id for sender and recipient
    const [senderRows] = await db.execute('SELECT user_id FROM Users WHERE email = ?', [sender]);
    const [recipientRows] = await db.execute('SELECT user_id FROM Users WHERE email = ?', [recipient]);

    if (senderRows.length === 0 || recipientRows.length === 0) {
      return res.status(404).send('Sender or recipient not found.');
    }

    const senderId = senderRows[0].user_id;
    const recipientId = recipientRows[0].user_id;

    // 2. Get project_id based on project title
    const [projectRows] = await db.execute('SELECT project_id FROM Projects WHERE title = ?', [project]);

    if (projectRows.length === 0) {
      return res.status(404).send('Project not found.');
    }

    const projectId = projectRows[0].project_id;

    // 3. Insert into Collaborators table
    const insertQuery = `
      INSERT INTO Collaborators (collaborator_id, project_id, user_id, invitation)
      VALUES (?, ?, ?, 'accepted')
    `;
    await db.execute(insertQuery, [recipientId, projectId, senderId]);

    res.send(`<h2>Thank you! You have successfully accepted the invitation to collaborate on "${project}".</h2>`);
  } catch (err) {
    console.error('Error inserting collaborator:', err);
    res.status(500).send('Something went wrong while accepting the invite.');
  }
});


  
 
  


// GET route to handle Decline
router.get('/decline-invite', async (req, res) => {
  const { project, sender, recipient } = req.query;

  if (!project || !sender || !recipient) {
    return res.status(400).send('Missing required parameters.');
  }

  try {
    const [senderRows] = await db.execute('SELECT user_id FROM Users WHERE email = ?', [sender]);
    const [recipientRows] = await db.execute('SELECT user_id FROM Users WHERE email = ?', [recipient]);
    const [projectRows] = await db.execute('SELECT project_id FROM Projects WHERE title = ?', [project]);

    if (!senderRows.length || !recipientRows.length || !projectRows.length) {
      return res.status(404).send('Sender, recipient, or project not found.');
    }

    const senderId = senderRows[0].user_id;
    const recipientId = recipientRows[0].user_id;
    const projectId = projectRows[0].project_id;

    const insertQuery = `
      INSERT INTO Collaborators (collaborator_id, project_id, user_id, invitation)
      VALUES (?, ?, ?, 'declined')
    `;

    await db.execute(insertQuery, [recipientId, projectId, senderId]);

    res.send(`<h2>You have declined the invitation to collaborate on "${project}".</h2>`);
  } catch (err) {
    console.error('Error logging declined invite:', err);
    res.status(500).send('Something went wrong while declining the invite.');
  }
});



module.exports = router;
