const jwt = require('jsonwebtoken');

const getObjectFromToken = (token) => {
  const object = jwt.verify(token, process.env.JWT_SECRET_KEY);
  return object;
}

module.exports = getObjectFromToken;