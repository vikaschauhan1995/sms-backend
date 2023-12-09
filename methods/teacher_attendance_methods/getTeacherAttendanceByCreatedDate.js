const teacher_attendance_table = require("../../constants/teacher_attendance_table");
const db = require('../../db');



const getTeacherAttendanceByCreatedDate = async (teacher_id, created_date) => {
  const getAttendanceQuery = `SELECT * FROM teacher_attendance WHERE ${teacher_attendance_table?.TEACHER_ID} = $1 AND ${teacher_attendance_table?.CREATED_DATE} = $2`;
  const getAttendanceResponse = await db.query(getAttendanceQuery, [teacher_id, created_date]);
  return getAttendanceResponse?.rows[0];
}

module.exports = {
  getTeacherAttendanceByCreatedDate
};