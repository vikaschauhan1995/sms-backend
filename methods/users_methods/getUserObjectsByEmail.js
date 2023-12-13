const db = require("../../db");


const getUserObjectsByEmail = async (email) => {
  const getUsersQuery = `SELECT * FROM users WHERE email=$1`;
  const getUsersResponse = await db.query(getUsersQuery, [email]);
  return getUsersResponse?.rows;
}

module.exports = {
  getUserObjectsByEmail
}