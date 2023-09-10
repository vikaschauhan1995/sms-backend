const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../db');

const users = require('../constants/users_table');
const verification = require('../constants/verification_table');

const createToken = (user_id) => {
  return jwt.sign({ user_id }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 });
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
      const token = createToken(user_?.[users?.USER_ID]);
      res.status(200).json({ token: token });
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
    const obj = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // res.status(200).json(obj);
    const verificationQuery = `SELECT * FROM verification WHERE ${verification?.USER_ID} = $1 AND ${verification?.OTP} = $2 LIMIT 1`;
    const verificationObj = await db.query(verificationQuery, [obj?.[verification?.USER_ID], obj?.[verification?.OTP]]);
    if (!verificationObj?.rows[0]?.[verification?.USER_ID] || !verificationObj?.rows[0]?.[verification?.OTP]) {
      throw Error('Verification failed / link could be used before');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const selectQuery = `SELECT * FROM users WHERE ${users?.USER_ID} = $1 LIMIT 1`;
    const userObj = await db.query(selectQuery, [obj?.[users?.USER_ID]]);
    if (!userObj?.rows[0]?.[users.USER_ID]) {
      throw Error("Couldn't find user_id");
    }
    const updateQuery = `UPDATE users SET ${users?.PASSWORD} = $1, ${users?.IS_ACTIVE} = $2`;
    const deleteVerificationRowQuery = `DELETE FROM verification WHERE ${verification?.USER_ID} = $1`;
    const updateUser = await db.query(updateQuery, [hash, true]);
    await db.query(deleteVerificationRowQuery, [obj?.[users?.USER_ID]])
    res.status(200).json(updateUser?.rows);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}



module.exports = {
  loginUser,
  generatePasswordForNewUser,
  createToken
};