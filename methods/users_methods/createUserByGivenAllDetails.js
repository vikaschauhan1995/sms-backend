const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const db = require('../../db.js');
const users_table = require("../../constants/users_table");
const validateUsername = require('../../utility/validateUsername');
const { getUserObjFromUsername } = require('./getUserObjFromUsername');



const createUserByGivenAllDetails = async (school_id, email, username, password, user_type, unique_id) => {
  if (!school_id) throw Error("School_id is required");
  if (!email) throw Error("Email is required");
  if (!username) throw Error("Username is required");
  if (!password) throw Error("Password is required");
  if (!user_type) throw Error("User_type is required");

  const isUsernameValid = validateUsername(username);
  if (!isUsernameValid) throw Error("Username is not valid")

  const user = await getUserObjFromUsername(username);
  if (user?.[users_table?.USERNAME]) throw Error("Username is already taken");

  const createUserQuery = `INSERT INTO users (${users_table.USER_ID}, ${users_table.SCHOOL_ID}, ${users_table.EMAIL}, ${users_table.USERNAME}, ${users_table.PASSWORD}, ${users_table.USER_TYPE}, ${users_table.IS_ACTIVE}) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING ${users_table.USER_ID}, ${users_table.SCHOOL_ID}, ${users_table.EMAIL}, ${users_table.USERNAME}, ${users_table.USER_TYPE}, ${users_table.IS_ACTIVE}, ${users_table.CREATED_ON}`;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const createUserResponse = await db.query(createUserQuery, [unique_id, school_id, email, username, hash, user_type, true]);
  return createUserResponse?.rows?.[0];
}

module.exports = {
  createUserByGivenAllDetails
}