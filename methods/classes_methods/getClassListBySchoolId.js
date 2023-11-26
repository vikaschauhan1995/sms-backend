const db = require('../../db');
const classes_table = require("../../constants/classes_table");


const getClassListBySchoolIdAndSessionYear = async (school_id, created_year) => {
  if (!school_id) throw Error("School id is not provided");
  const getClassListQuery = `SELECT * FROM classes WHERE ${classes_table?.SCHOOL_ID} = $1 AND ${classes_table?.CREATED_YEAR} = $2`;
  const getClassListResponse = await db.query(getClassListQuery, [school_id, created_year]);
  return getClassListResponse?.rows;
}


module.exports = {
  getClassListBySchoolIdAndSessionYear
};