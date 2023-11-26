const express = require('express');
const { getStudentAttendanceOfClass, postStudentAttendance } = require('../controllers/studentAttendanceController');
const router = express.Router();


router.get(`/`, getStudentAttendanceOfClass);
router.post('/', postStudentAttendance);

module.exports = router;