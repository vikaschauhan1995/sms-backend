const { verification_table } = require("../constants/verification_table");
const db = require("../db");

const deleteVerification = async (unique_id, purpose) => {
  const deleteVerificationQuery = `DELETE FROM verification WHERE ${verification_table?.UNIQUE_ID} = $1 AND ${verification_table?.PURPOSE} = $2  RETURNING *`;
  const deleteVerificationResponse = await db.query(deleteVerificationQuery, [unique_id, purpose]);
  return deleteVerificationResponse?.rows?.[0];
}

const getVerification = async (unique_id, purpose, otp) => {
  const deleteVerificationQuery = `SELECT * FROM verification WHERE ${verification_table?.UNIQUE_ID} = $1 AND ${verification_table?.PURPOSE} = $2 AND ${verification_table?.OTP} = $3 LIMIT 1`;
  const deleteVerificationResponse = await db.query(deleteVerificationQuery, [unique_id, purpose, otp]);
  return deleteVerificationResponse?.rows?.[0];
}

module.exports = {
  deleteVerification,
  getVerification
};