const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../db');

const users = require('../constants/users_table');
const user_type = require('../constants/user_type_table')


const createToken = (user_id) => {
  return jwt.sign({ user_id }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 });
}

const createAdmin = async (req, res) => {
  const { username, email, password, type } = req.body;
  try {
    if (!username || !email || !password) {
      throw Error('All fields must be filled');
    }
    const query = `SELECT * FROM users WHERE username = $1 OR email = $2`;
    const oldUser = await db.query(query, [username, email]);
    if (oldUser.rows.length > 0) {
      throw Error(`${username} is already in use`);
    }
    if (oldUser.rows.length === 0) {
      const query = `INSERT INTO users (${users.USER_ID}, ${users.EMAIL}, ${users.USERNAME}, ${users.PASSWORD}) VALUES($1, $2, $3, $4)`;
      const queryUserType = `INSERT INTO user_type (${users.USER_ID}, ${user_type.TYPE}) VALUES($1, $2)`;
      const user_id = uuidv4();
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      await db.query(query, [user_id, email, username, hash]);
      await db.query(queryUserType, [user_id, type]);
      res.status(200).json({ user_id, hash });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      throw Error('All fields must be filled');
    }
    const query = `SELECT * FROM users WHERE ${users.USERNAME} = $1 OR ${users.EMAIL} = $2 LIMIT 1`;
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
      const token = createToken(user_?.[users.USER_ID]);
      res.status(200).json({ token: token });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createAdmin,
  loginUser
};