const db = require("../../db");


const teacherAttendanceOfRange = async (school_id, start_date, end_date) => {
  if (!school_id) throw Error('School Id is required');
  if (!start_date) throw Error('Start Date is required');
  if (!end_date) throw Error('End Date is required');
  const getTeacherAttendanceQuery = `SELECT
  DATE_TRUNC('day', created_date) AS created_date,
  ARRAY_AGG(
    jsonb_build_object(
      'id', id,
      'teacher_id', teacher_id,
      'school_id', school_id,
      'created_by', created_by,
      'is_present', is_present,
      'comment', comment,
      'created_on', created_on
    )
  ) AS attendance_data
FROM
  teacher_attendance
WHERE
  created_date >= '${start_date}' AND created_date < '${end_date}'
GROUP BY
  created_date
ORDER BY
  created_date desc;
`;
  // console.log("getTeacherAttendanceQuery=>", getTeacherAttendanceQuery);
  const teacherAttendanceResponse = await db.query(getTeacherAttendanceQuery, []);
  return teacherAttendanceResponse?.rows;
}

module.exports = {
  teacherAttendanceOfRange
}