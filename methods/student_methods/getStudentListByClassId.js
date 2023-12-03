

const db = require('../../db');
const student_table = require('../../constants/student_table');



const getStudentListByClassId = async (class_id) => {
  if(!class_id) throw Error('Class id is required');
  const getAttendanceQuery = `SELECT * FROM student WHERE ${student_table?.CLASS_ID} = $1`;
  const getAttendanceResponse = await db.query(getAttendanceQuery, [class_id]);
  return getAttendanceResponse?.rows;
}

module.exports = {
  getStudentListByClassId
};