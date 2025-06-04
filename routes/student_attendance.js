const express = require('express');
const { getTodaysAttendanceOfClassStudent, postStudentAttendance, getClassAttendanceOfMonth, postStudentAttendanceByDate, getMyAttendanceOfMonth, getStudentAttendanceSummary } = require('../controllers/studentAttendanceController');
const { student_attendance_table } = require('../constants/student_attendance_table');
const { session_year_table } = require('../constants/session_year_table');
const router = express.Router();


router.get(`/class/:${student_attendance_table?.CLASS_ID}`, getTodaysAttendanceOfClassStudent);
router.get(`/${session_year_table?.YEAR}/:${session_year_table?.YEAR}/class_id/:${student_attendance_table?.CLASS_ID}/month/:month`, getClassAttendanceOfMonth);
router.post('/', postStudentAttendance);
router.post('/date', postStudentAttendanceByDate);
router.get(`/${session_year_table?.YEAR}/:${session_year_table?.YEAR}/month/:month`, getMyAttendanceOfMonth);
router.get(`/${session_year_table?.YEAR}/:${session_year_table?.YEAR}/summary`, getStudentAttendanceSummary);

module.exports = router;