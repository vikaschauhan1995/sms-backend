const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../db');

const users = require('../constants/users_table');

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
      const token = createToken(user_?.[users.USER_ID]);
      res.status(200).json({ token: token });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const generatePasswordForNewUser = async (req, res) => {
  const { token, password, rePassword } = req.body;
  try {
    const decode = jwt.verify(token, "process.env.JWT_SECRET_KEY");
    console.log("decode=>", decode);
    res.status(200).json({ message: "yoyo" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}



module.exports = {
  loginUser,
  generatePasswordForNewUser,
  createToken
};