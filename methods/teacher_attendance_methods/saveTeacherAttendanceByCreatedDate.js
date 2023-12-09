
const teacher_attendance_table = require('../../constants/teacher_attendance_table');
const db = require('../../db');


const saveTeacherAttendanceByCreatedDate = async (school_id, created_by, created_date, teacher_id, is_present) => {
  if(!school_id) throw Error("School id is not provided");
  if(!created_by) throw Error("Creater id is not provided");
  if(!created_date) throw Error("Created date is not provided");
  if(!teacher_id) throw Error("Teacher id is not provided");
  if(typeof is_present !== 'boolean') throw Error("Attendance boolean is not provided");

  const saveTeacherAttendanceQuery = `INSERT INTO teacher_attendance (${teacher_attendance_table?.TEACHER_ID}, ${teacher_attendance_table?.SCHOOL_ID}, ${teacher_attendance_table?.CREATED_BY}, ${teacher_attendance_table?.CREATED_DATE}, ${teacher_attendance_table?.IS_PRESENT}, ${teacher_attendance_table?.COMMENT}) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
  const saveTeacherAttendanceResponse = await db.query(saveTeacherAttendanceQuery, [teacher_id, school_id, created_by, created_date, is_present, ""]);
  return saveTeacherAttendanceResponse?.rows?.[0];
}

module.exports = {
  saveTeacherAttendanceByCreatedDate
}