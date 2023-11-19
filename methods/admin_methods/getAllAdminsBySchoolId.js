const { v4: uuidv4 } = require('uuid');
const admin_table = require('../../constants/admin_table');
const db = require('../../db');


const getAllAdminsBySchoolId = async (school_id) => {
  if (!school_id) throw Error("School id is required");
  const getAdminsBySchoolIdQuery = `SELECT * FROM admin WHERE ${admin_table?.SCHOOL_ID} = $1`;
  const getAdminBySchoolIdResponse = await db.query(getAdminsBySchoolIdQuery, [school_id]);
  return getAdminBySchoolIdResponse?.rows;
}

module.exports = {
  getAllAdminsBySchoolId
}