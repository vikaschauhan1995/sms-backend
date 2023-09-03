const express = require('express');

const router = express.Router();

const { createAdmin, loginUser } = require('../controllers/authController.js');
const school = require('../constants/users_table.js');

router.post(`/createAdmin/:${school.SCHOOL_ID}`, createAdmin);
router.post('/login', loginUser);

module.exports = router;