const express = require('express');
const router = express.Router();

const users = require('../constants/users_table');
const { createStudent, getAllStudentsByUserType, getStudent, updateStudent, deleteStudent } = require('../controllers/studentController');


router.post(`/:${users?.USER_ID}`, createStudent);
router.get(`/all/:${users?.USER_ID}`, getAllStudentsByUserType);
router.get(`/:${users?.USER_ID}`, getStudent)
router.put(`/:${users?.USER_ID}`, updateStudent);
router.delete(`/:${users?.USER_ID}`, deleteStudent);

module.exports = router;