const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

const db = mysql.createConnection({
    host: 'urcp-server.mysql.database.azure.com',
    user: 'Laylow96',
    password: '@z4s74b8',
    database: 'urcp-database',
    ssl: {
      rejectUnauthorized: true 
    }
  });

//
router.get('/', (req, res) => {
    const query = `
      SELECT 
        u1.email AS sender_email,
        u2.email AS collaborator_email,
        p.project_name,
        c.invitation,
        c.added_at
      FROM Collaborators c
      JOIN Users u1 ON u1.user_id = c.user_id
      JOIN Users u2 ON u2.user_id = c.collaborator_id
      JOIN Projects p ON p.project_id = c.project_id
      ORDER BY c.added_at DESC
    `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }
    res.json(results);
  });
});

module.exports = router;