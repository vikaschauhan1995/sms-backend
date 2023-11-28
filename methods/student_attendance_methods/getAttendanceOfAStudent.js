const { student_attendance_table } = require("../../constants/student_attendance_table");
const db = require("../../db");


const getAttendanceOfAStudent = async (student_id, created_date) => {
  if(!student_id) throw Error("Student id is required");
  if(!created_date) throw Error("Created date is required");
  const getAttendanceQuery = `SELECT * FROM student_attendance WHERE ${student_attendance_table?.STUDENT_ID} = $1 AND ${student_attendance_table?.CREATED_DATE} = $2`;
  const getAttendanceResponse = await db.query(getAttendanceQuery, [student_id, created_date]);
  return getAttendanceResponse?.rows?.[0];
}

module.exports = {
  getAttendanceOfAStudent
}