const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../db');

const users = require('../constants/users_table');
const { verification_table } = require('../constants/verification_table');
const createTokenForObject = require('../methods/createTokenForObject');
const getObjectFromToken = require('../methods/getObjectFromToken');
const validateUsername = require('../utility/validateUsername');
const users_table = require('../constants/users_table');
const { getVerification } = require('../methods/verificationMethods');
const { getUserObjFromUsername } = require('../methods/users_methods/getUserObjFromUsername');
const { verifyTokenMethod } = require('../methods/auth_methods/verifyTokenMethod');

const createToken = (user_id) => {
  const expiration = '1d'; // 1 day
  return jwt.sign({ user_id }, process.env.JWT_SECRET_KEY, { expiresIn: expiration });
}


const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      throw Error('All fields must be filled');
    }
    const query = `SELECT * FROM users WHERE ${users.USERNAME} = $1 OR ${users.EMAIL} = $2 AND ${users.IS_ACTIVE} IS TRUE LIMIT 1`;
    const user = await db.query(query, [username, username]);
    if (user.rows.length === 0) {
      throw Error('Invalid username or password');
    }
    if (user.rows.length === 1) {
      const pMatch = await bcrypt.compare(password, user?.rows[0].password);
      if (!pMatch) {
        throw Error('Invalid password');
      }
      const user_ = user.rows[0];
      delete user_?.[users?.PASSWORD];
      const token = createTokenForObject(user_);
      res.status(200).json({ token, user: user_ });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const generatePasswordForNewUser = async (req, res) => {
  const { token, password, rePassword } = req.body;
  try {
    if (!token) {
      throw Error('Token required');
    }
    if (!password || !rePassword) {
      throw Error('Password required');
    }
    if(password !== rePassword) {
      throw Error('Password not match');
    }
    const obj = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // res.status(200).json(obj);
    const verificationQuery = `SELECT * FROM verification WHERE ${verification_table?.USER_ID} = $1 AND ${verification_table?.OTP} = $2 LIMIT 1`;
    const verificationObj = await db.query(verificationQuery, [obj?.[verification_table?.USER_ID], obj?.[verification_table?.OTP]]);
    if (!verificationObj?.rows[0]?.[verification_table?.USER_ID] || !verificationObj?.rows[0]?.[verification_table?.OTP]) {
      throw Error('Verification failed / link could be used before');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const selectQuery = `SELECT * FROM users WHERE ${users?.USER_ID} = $1 LIMIT 1`;
    const userObj = await db.query(selectQuery, [obj?.[users?.USER_ID]]);
    if (!userObj?.rows[0]?.[users.USER_ID]) {
      throw Error("Couldn't find user_id");
    }
    const updateQuery = `UPDATE users SET ${users?.PASSWORD} = $1`;
    const deleteVerificationRowQuery = `DELETE FROM verification WHERE ${verification_table?.USER_ID} = $1`;
    const updateUser = await db.query(updateQuery, [hash]);
    await db.query(deleteVerificationRowQuery, [obj?.[users?.USER_ID]])
    res.status(200).json(updateUser?.rows);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const verifyToken = async (req, res) => {
  try{
    const { token } = req.params;
    const getObj = await verifyTokenMethod(token);
    res.status(200).json(getObj);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

const usernameValidation = async (req, res) => {
  try{
    const { username } = req.query;
    if(!username) throw Error('Username is required');
    const isValid = validateUsername(username);
    if(!isValid) throw Error('Username is not valid');
    const user = await getUserObjFromUsername(username);
    if(user?.[users_table?.USERNAME]){
      throw Error("Username is already taken");
    }
    res.status(200).json(isValid);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}


module.exports = {
  loginUser,
  generatePasswordForNewUser,
  createToken,
  verifyToken,
  usernameValidation
};