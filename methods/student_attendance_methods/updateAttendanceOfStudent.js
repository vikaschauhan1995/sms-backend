const { student_attendance_table } = require("../../constants/student_attendance_table");
const db = require("../../db");


const updateAttendanceOfStudent = async (student_id, created_date, is_present) => {
  if(!student_id) throw Error("Student id is required");
  if(!created_date) throw Error("Created date is required");
  if(typeof is_present !== 'boolean') throw Error("Student attendance must be a boolean");
  const getAttendanceQuery = `UPDATE student_attendance SET ${student_attendance_table?.IS_PRESENT} = $1 WHERE ${student_attendance_table?.STUDENT_ID} = $2 AND ${student_attendance_table?.CREATED_DATE} = $3 RETURNING *, to_char(${student_attendance_table?.CREATED_DATE}, 'YYYY-MM-DD') AS created_date`;
  const getAttendanceResponse = await db.query(getAttendanceQuery, [is_present, student_id, created_date]);
  return getAttendanceResponse?.rows?.[0];
}

module.exports = {
  updateAttendanceOfStudent
}