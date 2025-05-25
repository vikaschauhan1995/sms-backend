const teacher_attendance_table = require("../../constants/teacher_attendance_table");
const db = require('../../db');


const updateAttendanceOfTeacher = async (teacher_id, created_date, is_present) => {
  if(!teacher_id) throw Error("Teacher id is required");
  if(!created_date) throw Error("Created date is required");
  if(typeof is_present !== 'boolean') throw Error("Teacher attendance must be a boolean");
  // const getAttendanceQuery = `UPDATE teacher_attendance SET ${teacher_attendance_table?.IS_PRESENT} = $1 WHERE ${teacher_attendance_table?.TEACHER_ID} = $2 AND ${teacher_attendance_table?.CREATED_DATE} = $3 RETURNING *`;
  const getAttendanceQuery = `UPDATE teacher_attendance 
  SET ${teacher_attendance_table?.IS_PRESENT} = $1 
  WHERE ${teacher_attendance_table?.TEACHER_ID} = $2 
  AND ${teacher_attendance_table?.CREATED_DATE}::date = $3::date 
  RETURNING ${teacher_attendance_table?.TEACHER_ID}, 
            ${teacher_attendance_table?.IS_PRESENT}, 
            to_char(${teacher_attendance_table?.CREATED_DATE}, 'YYYY-MM-DD') as created_date`;
  const getAttendanceResponse = await db.query(getAttendanceQuery, [is_present, teacher_id, created_date]);
  return getAttendanceResponse?.rows?.[0];
}

module.exports = {
  updateAttendanceOfTeacher
}