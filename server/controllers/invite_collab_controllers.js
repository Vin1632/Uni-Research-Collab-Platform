const pool = require('../db');

async function insert_invitations(Recipient_email, Sender_email, Title) {
    try {
        const [senderResult] = await pool.query(
            `SELECT user_id FROM Users WHERE email = ?`,
            [Sender_email]
        );

        const [recipientResult] = await pool.query(
            `SELECT user_id FROM Users WHERE email = ?`,
            [Recipient_email]
        );

        const [projectResult] = await pool.query(
            `SELECT project_id FROM Projects WHERE title = ?`,
            [Title]
        );

        if (senderResult.length > 0 && recipientResult.length > 0 && projectResult.length > 0) {
            const senderId = senderResult[0].user_id;
            const recipientId = recipientResult[0].user_id;
            const projectId = projectResult[0].project_id;

            const [insertResult] = await pool.query(
                `INSERT INTO Collaborators (collaborator_id, project_id, user_id) VALUES (?, ?, ?)`,
                [recipientId, projectId, senderId]
            );

            return insertResult;
        } else {
            throw new Error('Insert failed: One or more references not found.');
        }
    } catch (error) {
        console.error("Failed to insert into Collaborators table:", error);
        throw error;
    }
}

async function get_email_project_id(id) {
    try {
        const [result] = await pool.query(`SELECT user_id FROM projects WHERE project_id = ?`, [id]);
        if(result.length > 0)
        {
            const [result_userID] = await pool.query("SELECT email FROM Users WHERE user_id = ? ", [result[0].user_id]);
            return result_userID[0].email;
        }
    } catch (error) {
        console.error("Failed to GET eamil using Project_Id", error);
        throw error;
    }
}

module.exports = {insert_invitations, get_email_project_id};