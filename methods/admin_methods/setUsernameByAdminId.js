const db = require('../../db');
const admin_table = require("../../constants/admin_table");
const { getAdminByAdminId } = require("./getAdminByAdminId");


const setUsernameByAdminId = async (admin_id, username) => {
  if(!admin_id) throw Error("Admin Id is required");
  if (!username) throw Error("Username is required");
  const admin = await getAdminByAdminId(admin_id);
  if(!admin) throw Error("Admin not found");
  const updatedAdminQuery = `UPDATE admin SET ${admin_table?.USERNAME} = $1 WHERE ${admin_table?.ADMIN_ID} = $2 RETURNING *`;
  const updatedAdminResponse = await db.query(updatedAdminQuery, [username, admin_id]);
  return updatedAdminResponse?.rows?.[0];
}

module.exports = {
  setUsernameByAdminId
};