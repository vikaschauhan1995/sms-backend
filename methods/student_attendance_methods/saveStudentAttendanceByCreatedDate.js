const db = require('../../db');
const { student_attendance_table } = require("../../constants/student_attendance_table");



const saveStudentAttendanceByCreatedDate = async (school_id, class_id, created_by, created_date, student_id, is_present) => {
  if(!school_id) throw Error("School id is not provided");
  if(!class_id) throw Error("Class id is not provided");
  if(!created_by) throw Error("Creater id is not provided");
  if(!created_date) throw Error("Created date is not provided");
  if(!student_id) throw Error("Student id is not provided");
  if(typeof is_present !== 'boolean') throw Error("Attendance boolean is not provided");

  const saveStudentAttendanceQuery = `INSERT INTO student_attendance (${student_attendance_table?.STUDENT_ID}, ${student_attendance_table?.CLASS_ID}, ${student_attendance_table?.SCHOOL_ID}, ${student_attendance_table?.CREATED_BY}, ${student_attendance_table?.CREATED_DATE}, ${student_attendance_table?.IS_PRESENT}, ${student_attendance_table?.COMMENT}) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *, to_char(${student_attendance_table?.CREATED_DATE}, 'YYYY-MM-DD') AS created_date`;
  const saveStudentAttendanceResponse = await db.query(saveStudentAttendanceQuery, [student_id, class_id, school_id, created_by, created_date, is_present, ""]);
  return saveStudentAttendanceResponse?.rows?.[0];
}

module.exports = {
  saveStudentAttendanceByCreatedDate
};