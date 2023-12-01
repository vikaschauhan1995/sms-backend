const db = require("../../db");
const { student_attendance_table } = require("../../constants/student_attendance_table");


const classAttendanceOfRange = async (class_id, start_date, end_date) => {
  if (!class_id) throw Error('Class Id is required');
  if (!start_date) throw Error('Start Date is required');
  if (!end_date) throw Error('End Date is required');
  // const getClassAttendanceQuery = `SELECT * FROM student_attendance WHERE ${student_attendance_table?.CLASS_ID} = $1 AND ${student_attendance_table?.CREATED_DATE} >= $2 ::DATE AND ${student_attendance_table?.CREATED_DATE} < $3 ::DATE ORDER BY ${student_attendance_table?.CREATED_DATE} ASC`;
  const getClassAttendanceQuery = `SELECT
  DATE_TRUNC('day', created_date) AS created_date,
  ARRAY_AGG(
    jsonb_build_object(
      'id', id,
      'student_id', student_id,
      'class_id', class_id,
      'school_id', school_id,
      'created_by', created_by,
      'is_present', is_present,
      'comment', comment,
      'created_on', created_on
    )
  ) AS attendance_data
FROM
  student_attendance
WHERE
  created_date >= '${start_date}' AND created_date < '${end_date}'
GROUP BY
  created_date
ORDER BY
  created_date desc;
`;
  console.log("getClassAttendanceQuery=>", getClassAttendanceQuery);
  const classAttendanceResponse = await db.query(getClassAttendanceQuery, []);
  return classAttendanceResponse?.rows;
}

module.exports = {
  classAttendanceOfRange
}