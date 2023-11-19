const { v4: uuidv4 } = require('uuid');
const admin_table = require('../../constants/admin_table');
const db = require('../../db');


const deleteAdminByAdminId = async (admin_id) => {
  if (!admin_id) throw Error("Admin id required");
  const deleteAdminQuery = `DELETE from admin WHERE ${admin_table?.ADMIN_ID} = $1 RETURNING *`;
  const deleteAdminResponse = await db.query(deleteAdminQuery, [admin_id]);
  return deleteAdminResponse?.rows?.[0];
}

module.exports = {
  deleteAdminByAdminId
}