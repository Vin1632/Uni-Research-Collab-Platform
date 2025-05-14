const db = require('../db');

async function handleInvite(req, res) {
  const { toEmail, fromUser, projectTitle } = req.body;

  if (!toEmail || !fromUser || !projectTitle) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Look up sender and recipient user IDs
    const [senderRows] = await db.execute('SELECT user_id FROM Users WHERE email = ?', [fromUser]);
    const [recipientRows] = await db.execute('SELECT user_id FROM Users WHERE email = ?', [toEmail]);
    const [projectRows] = await db.execute('SELECT project_id FROM Projects WHERE title = ?', [projectTitle]);

    if (!senderRows.length || !recipientRows.length || !projectRows.length) {
      return res.status(404).json({ message: 'Sender, recipient, or project not found' });
    }

    const senderId = senderRows[0].user_id;
    const recipientId = recipientRows[0].user_id;
    const projectId = projectRows[0].project_id;

    // Insert into Collaborators table
    await db.execute(
      `INSERT INTO Collaborators (collaborator_id, project_id, user_id, invitation)
       VALUES (?, ?, ?, 'pending')`,
      [recipientId, projectId, senderId]
    );

    
    return;

  } catch (err) {
    console.error('Error inserting collaborator:', err);
    throw err;
  }
}

module.exports = {
  handleInvite,
};
