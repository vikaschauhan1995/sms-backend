const express = require('express');

const router = express.Router();

const { loginUser } = require('../controllers/authController.js');
const school = require('../constants/users_table.js');

router.post('/login', loginUser);

module.exports = router;