const express = require('express');

const router = express.Router();

const { getUsersBySchool } = require('../controllers/usersController.js');
const user = require('../constants/users_table.js');

router.get(`/:${user.SCHOOL_ID}`, getUsersBySchool);

module.exports = router;