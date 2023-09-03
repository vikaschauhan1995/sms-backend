const jwt = require('jsonwebtoken');


const tokenValidation = async (req, res, next) => {
  const { authentication } = req.headers;
  if (!authentication) {
    return res.json({ message: 'Authentication token is required' });
  }
  try {
    const token = authentication?.split(' ')[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!id) {
      throw Error('Authentication token failed');
    }
    next();
  } catch (error) {
    res.json({ error: 'Authentication token error ' + error.message });
  }
}

module.exports = tokenValidation;