const express = require('express');

const router = express.Router();

const { loginUser, generatePasswordForNewUser, verifyToken, usernameValidation } = require('../controllers/authController.js');
const { createUserByUsernameAndPassword, getUsersByEmail, forgetPasswordRequest } = require('../controllers/usersController.js');
const users_table = require('../constants/users_table.js');

router.post('/login', loginUser);
router.post('/new_password', generatePasswordForNewUser);
router.get('/verify_token/:token', verifyToken);
router.get('/username_validation', usernameValidation);
router.post('/create_user', createUserByUsernameAndPassword);
router.get(`/get_users/:${users_table?.EMAIL}`, getUsersByEmail);
router.get(`/forget_password/request/:${users_table?.USERNAME}`, forgetPasswordRequest);

module.exports = router;