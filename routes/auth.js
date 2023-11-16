const express = require('express');

const router = express.Router();

const { loginUser, generatePasswordForNewUser, verifyToken, usernameValidation } = require('../controllers/authController.js');
const { createUserByUsernameAndPassword } = require('../controllers/usersController.js');

router.post('/login', loginUser);
router.post('/new_password', generatePasswordForNewUser);
router.get('/verify_token/:token', verifyToken);
router.get('/username_validation', usernameValidation);
router.post('/create_user', createUserByUsernameAndPassword);

module.exports = router;