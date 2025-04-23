const pool = require('../db');

async function insert_Users(name, email, role, institution, qualification, interests) {
  try {
    const result = await pool.query(
      "INSERT INTO Users (name, email, role, institution, qualification, interests) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, role, institution, qualification, interests]
    );
    return result;
  } catch (error) {
    console.error('Insert user error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('User with this email already exists');
    }

    throw new Error('Failed to add a User');
  }
}

async function get_User_By_Email(emailObj) {
  try {
    const email = emailObj.email;
    const queryResult = await pool.query(
      "SELECT email, user_id FROM Users WHERE email = ?", [email]
    );
    const result = queryResult[0] || [];
    return result.length ? result : [];
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

module.exports = {
  insert_Users,
  get_User_By_Email
};
