const db = require('../../db');
const classes_table = require("../../constants/classes_table");


const getClassListBySchoolId = async (school_id) => {
  if (!school_id) throw Error("School id is not provided");
  const getClassListQuery = `SELECT * FROM classes WHERE ${classes_table?.SCHOOL_ID} = $1`;
  const getClassListResponse = await db.query(getClassListQuery, [school_id]);
  return getClassListResponse?.rows;
}


module.exports = {
  getClassListBySchoolId
};