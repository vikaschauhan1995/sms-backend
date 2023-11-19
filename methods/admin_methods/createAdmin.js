const { v4: uuidv4 } = require('uuid');
const admin_table = require('../../constants/admin_table');
const db = require('../../db');
const validateEmail = require('../../utility/validateEmail');

const createAdmin = async (school_id, name, email, mobile_number, address, created_by) => {
  if (!school_id) throw Error("School Id is required");
  if (!name) throw Error("Name is required");
  if (!email) throw Error("Email is required");
  if (!mobile_number) throw Error("Mobile number is required");
  if (!address) throw Error("Address is required");
  if (!created_by) throw Error("Created by id is required");
  if(validateEmail(email) === false) throw Error("Email is not valid");
  const admin_id = uuidv4();
  const createAdminQuery = `INSERT INTO admin (${admin_table?.ADMIN_ID}, ${admin_table?.SCHOOL_ID}, ${admin_table?.NAME}, ${admin_table?.EMAIL}, ${admin_table?.MOBILE_NUMBER}, ${admin_table?.ADDRESS}, ${admin_table?.IS_ACTIVE}, ${admin_table?.CREATED_BY}) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
  const createAdminResponse = await db.query(createAdminQuery, [admin_id, school_id, name, email, mobile_number, address, true, created_by]);
  return createAdminResponse?.rows?.[0];
}

module.exports = {
  createAdmin
}