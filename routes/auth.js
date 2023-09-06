const express = require('express');

const router = express.Router();

const { loginUser, generatePasswordForNewUser } = require('../controllers/authController.js');

router.post('/login', loginUser);
router.post('/new_password', generatePasswordForNewUser);

module.exports = router;