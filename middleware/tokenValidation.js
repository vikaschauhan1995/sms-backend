const jwt = require('jsonwebtoken');


const tokenValidation = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw Error("Token no available");
  }
  try {
    const token = authorization?.split(' ')[1];
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { user_id } = user;
    if (!user_id) {
      throw Error('Authorization token failed');
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Authorization token error', message: error.message });
  }
}

module.exports = tokenValidation;