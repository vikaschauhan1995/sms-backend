const db = require("../../db");


const getClassObjById = async (id) => {
  if (!id) throw Error("Class Id is required");
  const selectClass = `SELECT * FROM classes WHERE id = $1 LIMIT 1`;
  const selectClassResponse = await db.query(selectClass, [id]);
  return selectClassResponse?.rows[0];
}

module.exports = {
  getClassObjById
}