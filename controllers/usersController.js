const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const users = require('../constants/users_table');
const verification = require('../constants/verification_table');
const db = require('../db.js')
const nodeMailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const generatePasswordMail = require('../methods/generatePasswordMail');
const generateOTP = require('../methods/generateOTP');


const getUsersBySchool = async (req, res) => {
  const { school_id } = req.params;
  try {
    const query = `SELECT id, ${users.USER_ID}, ${users.SCHOOL_ID}, ${users.EMAIL}, ${users.USERNAME}, ${users.USER_TYPE}, ${users.CREATED_ON}, ${users.LAST_LOGIN} FROM users WHERE ${users.SCHOOL_ID} = $1`;
    const usersArray = await db.query(query, [school_id]);
    res.status(200).json(usersArray.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const createUser = async (username, email, type, school_id, old_user_id) => {
  if (!username || !email) {
    throw Error('All fields must be filled');
  }
  if (!school_id) {
    throw Error('Please provide school_id');
  }
  const query = `SELECT * FROM users WHERE (${users.SCHOOL_ID} = $1 AND ${users.USERNAME} = $2) OR (${users.SCHOOL_ID} = $3 AND ${users.EMAIL} = $4)`;
  const hasAlreadyUser = await db.query(query, [school_id, username, school_id, email]);
  if (hasAlreadyUser.rows.length > 0) {
    throw Error(`${username} is already in use`);
  }
  if (hasAlreadyUser.rows.length === 0) {
    const query = `INSERT INTO users (${users.USER_ID}, ${users.SCHOOL_ID}, ${users.EMAIL}, ${users.USERNAME}, ${users.PASSWORD}, ${users.USER_TYPE}, ${users.IS_ACTIVE}) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING ${users.USER_ID}, ${users.SCHOOL_ID}, ${users.EMAIL}, ${users.USERNAME}, ${users.USER_TYPE}, ${users.IS_ACTIVE}, ${users.CREATED_ON}`;
    const generate_password_query = `INSERT INTO verification (${verification?.USER_ID}, ${verification?.PURPOSE}, ${verification?.OTP}) VALUES($1, $2, $3)`;
    const otp = generateOTP(6);
    const user_id = old_user_id ? old_user_id : uuidv4();
    await db.query(generate_password_query, [user_id, "generate password", otp]);
    await generatePasswordMail(email, user_id, otp);
    const newUserQueryResponse = await db.query(query, [user_id, school_id, email, username, "OOPS", type, false]);
    return newUserQueryResponse?.rows?.[0];
  }
}

const createUserRoute = async (req, res) => {
  const { username, email, user_type } = req.body;
  const { school_id } = req.params;
  try {
    const newUserId = await createUser(username, email, user_type, school_id);
    res.status(200).json(newUserId);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const getAllUsers = async (req, res) => {
  try {
    const query = `SELECT id, ${users.USER_ID}, ${users.SCHOOL_ID}, ${users.EMAIL}, ${users.USERNAME}, ${users.USER_TYPE}, ${users.CREATED_ON}, ${users.LAST_LOGIN} FROM users`;
    const userList = await db.query(query);
    res.status(200).json(userList.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const getUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    if (!user_id) {
      throw Error(`${users.USER_ID} is not available`);
    }
    const query = `SELECT id, ${users.USER_ID}, ${users.SCHOOL_ID}, ${users.EMAIL}, ${users.USERNAME}, ${users.USER_TYPE}, ${users.CREATED_ON}, ${users.LAST_LOGIN} FROM users WHERE ${users.USER_ID} = $1`;
    const user = await db.query(query, [user_id]);
    res.status(200).json(user.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const updateUser = async (req, res) => {
  const { username, email, user_type } = req.body;
  const { user_id } = req.params;
  try {
    if (!username || !email || !user_type) {
      throw Error('All field must be filled');
    }
    if (!user_id) {
      throw Error(`${users.USER_ID} is not available`);
    }
    const query = `UPDATE users SET
      ${users.USERNAME} = $1,
      ${users.EMAIL} = $2,
      ${users.USER_TYPE} = $3
      WHERE ${users.USER_ID} = $4
      RETURNING id, ${users.USER_ID}, ${users.SCHOOL_ID}, ${users.EMAIL}, ${users.USERNAME}, ${users.USER_TYPE}, ${users.CREATED_ON}, ${users.LAST_LOGIN}`;
    const updatedUser = await db.query(query, [username, email, user_type, user_id]);
    res.status(200).json(updatedUser.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const deleteUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    if (!user_id) {
      throw Error(`${users.USER_ID} is not available`);
    }
    const query = `DELETE FROM users WHERE ${users.USER_ID} = $1 RETURNING id, ${users.USER_ID}, ${users.SCHOOL_ID}, ${users.EMAIL}, ${users.USERNAME}, ${users.USER_TYPE}, ${users.CREATED_ON}, ${users.LAST_LOGIN}`;
    const deletedUser = await db.query(query, [user_id]);
    res.status(200).json(deletedUser.rows?.[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


module.exports = {
  getUsersBySchool,
  createUserRoute,
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
}