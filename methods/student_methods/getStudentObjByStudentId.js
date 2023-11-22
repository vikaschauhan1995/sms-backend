
const student_table = require('../../constants/student_table');
const db = require('../../db');

const getStudentObjByStudentId = async (student_id) => {
  const getStudentQuery = `SELECT * FROM student WHERE ${student_table?.STUDENT_ID} = $1`;
  const getStudentResponse = await db.query(getStudentQuery, [student_id]);
  return getStudentResponse?.rows?.[0];
} 

module.exports = {
  getStudentObjByStudentId
}