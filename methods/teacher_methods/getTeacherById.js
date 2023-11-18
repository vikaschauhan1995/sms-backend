const db = require('../../db');
const teacher_table = require('../../constants/teacher_table');

const getTeacherById = async function (teacher_id) {
  if (!teacher_id) {
    throw Error("Couldn't find the teacher's user id");
  }
  const selectQuery = `SELECT * FROM teacher WHERE ${teacher_table?.TEACHER_ID} = $1`;
  const selectQueryResponse = await db.query(selectQuery, [teacher_id]);
  const teacherObj = selectQueryResponse?.rows[0];
  // console.log("selectQueryResponse==>>", selectQueryResponse?.rows[0]);
  if (!teacherObj) {
    throw Error("Could't find the the teacher");
  }
  return teacherObj;
}

module.exports = {
  getTeacherById
};