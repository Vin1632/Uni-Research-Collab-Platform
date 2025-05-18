const db = require('../db');

async function handleAcceptInvite(req, res) {
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

    await db.execute(
      `INSERT INTO Collaborators (collaborator_id, project_id, user_id, invitation)
       VALUES (?, ?, ?, 'accepted')`,
      [recipientId, projectId, senderId]
    );

   res.redirect('https://uni-research-collab-wits.azurewebsites.net');
  } catch (err) {
    console.error('Error inserting collaborator:', err);
    res.status(500).send('Something went wrong while accepting the invite.');
  }
}

async function handleDeclineInvite(req, res) {
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

    await db.execute(
      `INSERT INTO Collaborators (collaborator_id, project_id, user_id, invitation)
       VALUES (?, ?, ?, 'declined')`,
      [recipientId, projectId, senderId]
    );

    res.redirect('https://uni-research-collab-wits.azurewebsites.net');
  } catch (err) {
    console.error('Error logging declined invite:', err);
    res.status(500).send('Something went wrong while declining the invite.');
  }
}

module.exports = {
  handleAcceptInvite,
  handleDeclineInvite,
};
