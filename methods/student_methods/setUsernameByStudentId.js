const db = require('../../db');
const student_table = require("../../constants/student_table");
const { getStudentObjByStudentId } = require("./getStudentObjByStudentId");



const setUsernameByStudentId = async (student_id, username) => {
  if(!student_id) throw Error("Student Id is required");
  if (!username) throw Error("Username is required");
  const student = await getStudentObjByStudentId(student_id);
  if(!student) throw Error("Student not found");
  const updatedStudentQuery = `UPDATE student SET ${student_table?.USERNAME} = $1 WHERE ${student_table?.STUDENT_ID} = $2 RETURNING *`;
  const updatedStudentResponse = await db.query(updatedStudentQuery, [username, student_id]);
  return updatedStudentResponse?.rows?.[0];
}

module.exports = {
  setUsernameByStudentId
}