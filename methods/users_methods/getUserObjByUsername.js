const db = require('../../db.js');
const users_table = require("../../constants/users_table");


const getUserObjByUsername = async (username) => {
  const getUserQuery = `SELECT id, ${users_table.USER_ID}, ${users_table.SCHOOL_ID}, ${users_table.EMAIL}, ${users_table.USERNAME}, ${users_table.USER_TYPE}, ${users_table.CREATED_ON}, ${users_table.LAST_LOGIN} FROM users WHERE ${users_table?.USERNAME} = $1 LIMIT 1`;
  const getUserResponse = await db.query(getUserQuery, [username]);
  return getUserResponse?.rows?.[0];
}

module.exports = {
  getUserObjByUsername
};