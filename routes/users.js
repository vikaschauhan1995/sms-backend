const express = require('express');
const router = express.Router();
const school = require('../constants/school_table');

const { getUsersBySchool, getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/usersController.js');
const user = require('../constants/users_table.js');

router.get(`/school/:${user.SCHOOL_ID}`, getUsersBySchool);
router.get(`/:${user.USER_ID}`, getUser);
router.get(`/`, getAllUsers);
router.put(`/:${user.USER_ID}`, updateUser);
router.delete(`/:${user.USER_ID}`, deleteUser);

module.exports = router;