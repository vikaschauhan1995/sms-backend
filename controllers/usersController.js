const users = require('../constants/users_table');
const db = require('../db.js')

const getUsersBySchool = async (req, res) => {
  const { school_id } = req.params;
  try {
    const query = `SELECT * FROM users WHERE ${users.SCHOOL_ID} = $1`;
    const usersArray = await db.query(query, [school_id]);
    res.status(200).json(usersArray.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}



module.exports = {
  getUsersBySchool
}