const jwt = require('jsonwebtoken');

const createTokenForObject = (object) => {
  const expiration = '1d'; // 1 day
  return jwt.sign(object, process.env.JWT_SECRET_KEY, { expiresIn: expiration });
}

module.exports = createTokenForObject;