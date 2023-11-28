const express = require('express');
const { getTodaysAttendanceOfClassStudent, postStudentAttendance } = require('../controllers/studentAttendanceController');
const { student_attendance_table } = require('../constants/student_attendance_table');
const router = express.Router();


router.get(`/class/:${student_attendance_table?.CLASS_ID}`, getTodaysAttendanceOfClassStudent);
router.post('/', postStudentAttendance);

module.exports = router;