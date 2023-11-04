const express = require('express');
const router = express.Router();

// const { createStudent, getAllStudentsByUserType, getStudent, updateStudent, deleteStudent } = require('../controllers/studentController_');
const { createStudent, getStudentsByClassId, updateStudentByStudentId, deleteStudentByStudentId } = require('../controllers/studentController');
const student_table = require('../constants/student_table');


// router.post(`/:${users?.USER_ID}`, createStudent);
// router.get(`/all/:${users?.USER_ID}`, getAllStudentsByUserType);
// router.get(`/:${users?.USER_ID}`, getStudent)
// router.put(`/:${users?.USER_ID}`, updateStudent);
// router.delete(`/:${users?.USER_ID}`, deleteStudent);

router.post(`/`, createStudent);
router.get(`/class/:${student_table?.CLASS_ID}`, getStudentsByClassId);
router.put(`/:${student_table?.STUDENT_ID}`, updateStudentByStudentId);
router.delete(`/:${student_table?.STUDENT_ID}`, deleteStudentByStudentId);

module.exports = router;