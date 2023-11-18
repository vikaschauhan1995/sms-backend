const db = require('../../db.js');
const users_table = require('../../constants/users_table');
const { getUserObjByUsername } = require('./getUserObjByUsername.js');

const deleteUserByUsername = async (username) => {
  if (!username) throw Error("Username is required");
  const user = await getUserObjByUsername(username);
  if (!user) throw Error("Couldn't find user");
  const deleteUserQuery = `DELETE FROM users WHERE ${users_table?.USERNAME} = $1 RETURNING *`;
  const deleteUserResponse = await db.query(deleteUserQuery, [username]);
  return deleteUserResponse?.rows?.[0];
}

module.exports = {
  deleteUserByUsername
};