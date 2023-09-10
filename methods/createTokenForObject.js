const jwt = require('jsonwebtoken');

const createTokenForObject = (object) => {
  return jwt.sign(object, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 });
}

module.exports = createTokenForObject;