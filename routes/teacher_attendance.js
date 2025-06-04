const express = require('express');
const router = express.Router();
const { postTeacherAttendance, updateTeacherAttendanceController, getTeacherAttendanceByDateAndSchoolId, getTeacherAttendanceOfMonth, getTeacherAttendanceSummary } = require('../controllers/teacherAttendanceController');
const teacher_attendance_table = require('../constants/teacher_attendance_table');


router.post(`/`, postTeacherAttendance);
router.put(`/:${teacher_attendance_table?.SCHOOL_ID}`, updateTeacherAttendanceController);
router.get(`/:${teacher_attendance_table?.SCHOOL_ID}/:${teacher_attendance_table?.CREATED_DATE}`, getTeacherAttendanceByDateAndSchoolId);
router.get(`/month/:YYYY/:MM`, getTeacherAttendanceOfMonth);
router.get(`/summary`, getTeacherAttendanceSummary);

module.exports = router;