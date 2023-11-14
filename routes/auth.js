const express = require('express');

const router = express.Router();

const { loginUser, generatePasswordForNewUser, verifyToken, usernameValidation } = require('../controllers/authController.js');

router.post('/login', loginUser);
router.post('/new_password', generatePasswordForNewUser);
router.get('/verify_token/:token', verifyToken);
router.get('/username_validation', usernameValidation);

module.exports = router;