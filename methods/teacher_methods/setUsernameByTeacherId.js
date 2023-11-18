const db = require('../../db');
const teacher_table = require('../../constants/teacher_table');
const { getTeacherById } = require('./getTeacherById');

const setUsernameByTeacherId = async (teacher_id, username) => {
  if (!teacher_id) throw Error("Teacher id is required");
  if (!username) throw Error("Username is required");
  const teacher = await getTeacherById(teacher_id);
  if (!teacher) throw Error("Teacher not found");
  const updateUsernameQuery = `UPDATE teacher SET ${teacher_table?.USERNAME} = $1 WHERE ${teacher_table?.TEACHER_ID} = $2 RETURNING *`;
  const updateusernameResponse = await db.query(updateUsernameQuery, [username, teacher_id]);
  return updateusernameResponse?.rows?.[0];
}

module.exports = {
  setUsernameByTeacherId
};