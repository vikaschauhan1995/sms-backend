const express = require('express');
const router = express.Router();

const users = require('../constants/users_table');
const { createTeacher, getAllTeachersByUsertype, getTeacher, updateTeacher, deleteTeacher } = require('../controllers/teacherController');


router.post(`/:${users?.USER_ID}`, createTeacher);
router.get(`/all/:${users?.USER_ID}`, getAllTeachersByUsertype);
router.get(`/:${users?.USER_ID}`, getTeacher)
router.put(`/:${users?.USER_ID}`, updateTeacher);
router.delete(`/:${users?.USER_ID}`, deleteTeacher);

module.exports = router;