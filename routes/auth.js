const express = require('express');

const router = express.Router();

const { loginUser, generatePasswordForNewUser, verifyToken, usernameValidation } = require('../controllers/authController.js');
const { createUserByUsernameAndPassword, getUsersByEmail } = require('../controllers/usersController.js');
const users_table = require('../constants/users_table.js');

router.post('/login', loginUser);
router.post('/new_password', generatePasswordForNewUser);
router.get('/verify_token/:token', verifyToken);
router.get('/username_validation', usernameValidation);
router.post('/create_user', createUserByUsernameAndPassword);
router.get(`/get_users/:${users_table?.EMAIL}`, getUsersByEmail);

module.exports = router;