const express = require('express');
const router = express.Router();

const users = require('../constants/users_table');
const { createTeacher, getAllTeachersByUsertype, getTeacher, updateTeacher, deleteTeacher, getAllTeachersBySchoolId } = require('../controllers/teacherController');
const teacher_table = require('../constants/teacher_table');


router.post(`/`, createTeacher);
router.get(`/all/:${users?.USER_ID}`, getAllTeachersByUsertype);
router.get(`/school/all/:${teacher_table?.SCHOOL_ID}`, getAllTeachersBySchoolId);
router.get(`/:${teacher_table?.TEACHER_ID}`, getTeacher)
router.put(`/:${teacher_table?.TEACHER_ID}`, updateTeacher);
router.delete(`/:${teacher_table?.TEACHER_ID}`, deleteTeacher);

module.exports = router;