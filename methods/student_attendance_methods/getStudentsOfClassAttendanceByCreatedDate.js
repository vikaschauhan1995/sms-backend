const db = require('../../db');
const { student_attendance_table } = require("../../constants/student_attendance_table");



const getStudentsOfClassAttendanceByCreatedDate = async (school_id, class_id, creatd_date) => {
  const getAttendanceQuery = `SELECT * FROM student_attendance WHERE ${student_attendance_table?.SCHOOL_ID} = $1 AND ${student_attendance_table?.CLASS_ID} = $2 AND ${student_attendance_table?.CREATED_DATE} = $3`;
  const getAttendanceResponse = await db.query(getAttendanceQuery, [school_id, class_id, creatd_date]);
  return getAttendanceResponse?.rows;
}

module.exports = {
  getStudentsOfClassAttendanceByCreatedDate
};