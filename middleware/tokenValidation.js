const getObjectFromToken = require("../methods/getObjectFromToken");

const tokenValidation = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw Error("Token no available");
    }
    const token = authorization?.split(' ')[1];
    const user = getObjectFromToken(token);
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