const pool = require("../db");

async function getProfile(email) {
  try {
    const [rows] = await pool.query("SELECT name, institution, qualification, interests FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      throw new Error("Profile not found");
    }
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function updateProfile(data) {
  const { email, name, institution, qualification, interests } = data;

  if (!email || typeof email !== 'string') {
    throw new Error("Invalid or missing email");
  }

  try {
    const [result] = await pool.query(
      `UPDATE users
       SET name = ?, institution = ?, qualification = ?, interests = ?
       WHERE email = ?`,
      [name, institution, qualification, interests, email.trim()]
    );

    if (result.affectedRows === 0) {
      throw new Error("Profile update failed: No user found with this email");
    }

    return { message: "Profile updated successfully" };
  } catch (error) {
    throw error;
  }
}


module.exports = { getProfile, updateProfile };