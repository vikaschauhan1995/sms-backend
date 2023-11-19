const { v4: uuidv4 } = require('uuid');
const admin_table = require('../../constants/admin_table');
const db = require('../../db');


const updateAdminById = async (admin_id, name, email, mobile_number, address) => {
  if (!admin_id) throw Error("Admin Id is required");
  if (!name) throw Error("Name is required");
  if (!email) throw Error("Email is required");
  if (!mobile_number) throw Error("Mobile Number is required");
  if (!address) throw Error("Address is required");
  const updateAdminQuery = `UPDATE admin SET
  ${admin_table?.NAME} = $1,
  ${admin_table?.EMAIL} = $2,
  ${admin_table?.MOBILE_NUMBER} = $3,
  ${admin_table?.ADDRESS} = $4
  WHERE ${admin_table?.ADMIN_ID} = $5
  RETURNING *`;
  const updateAdminResponse = await db.query(updateAdminQuery, [name, email, mobile_number, address, admin_id]);
  return updateAdminResponse?.rows?.[0];
}


module.exports = {
  updateAdminById
}