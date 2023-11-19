const { v4: uuidv4 } = require('uuid');
const admin_table = require('../../constants/admin_table');
const db = require('../../db');


const getAdminByAdminId = async (admin_id) => {
  if (!admin_id) throw Error("Admin Id is required");
  const getAdminQuery = `SELECT * FROM admin ${admin_table?.ADMIN_ID} = $1 limit 1`;
  const getAdminResponse = await db.query(getAdminQuery, [admin_id]);
  return getAdminResponse?.rows?.[0];
}

module.exports = {
  getAdminByAdminId
}