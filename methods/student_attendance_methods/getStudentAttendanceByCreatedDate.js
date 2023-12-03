
const db = require('../../db');
const { student_attendance_table } = require("../../constants/student_attendance_table");

const getStudentAttendanceByCreatedDate = async (student_id, created_date) => {
  const getAttendanceQuery = `SELECT * FROM student_attendance WHERE ${student_attendance_table?.STUDENT_ID} = $1 AND ${student_attendance_table?.CREATED_DATE} = $2`;
  const getAttendanceResponse = await db.query(getAttendanceQuery, [student_id, created_date]);
  return getAttendanceResponse?.rows[0];
}


module.exports = {
  getStudentAttendanceByCreatedDate
};