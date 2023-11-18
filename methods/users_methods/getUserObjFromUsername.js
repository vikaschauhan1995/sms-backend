const users_table = require("../../constants/users_table");
const db = require('../../db.js');


const getUserObjFromUsername = async (username) => {
  if (!username) throw Error("Username is not available");
  const getUserQuery = `SELECT * FROM users WHERE ${users_table?.USERNAME} = $1 LIMIT 1`;
  const getUserResponse = await db.query(getUserQuery, [username]);
  return getUserResponse.rows?.[0];
}

module.exports = {
  getUserObjFromUsername
}