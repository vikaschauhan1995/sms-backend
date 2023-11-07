
const { verification_table } = require('../constants/verification_table');
const generateOTP = require('./generateOTP');
const db = require('../db.js')

const createOTPVarification = async (unique_id, purpose) => {
  const otp = generateOTP(6);
  const findPreviousVerificationQuery = `SELECT * FROM verification WHERE ${verification_table?.UNIQUE_ID} = $1 AND ${verification_table?.PURPOSE} = $2`;
  const findPreviousVerificationResponse = await db.query(findPreviousVerificationQuery, [unique_id, purpose]);
  if(findPreviousVerificationResponse?.rows[0]){
    const updatePreviousVerificationQuery = `UPDATE verification SET ${verification_table?.OTP} = $1 WHERE ${verification_table?.UNIQUE_ID} = $2 AND ${verification_table?.PURPOSE} = $3 RETURNING *`;
    const updatePersistentVerificationResponse = await db.query(updatePreviousVerificationQuery, [otp, unique_id, purpose]);
    // console.log("updatePersistentVerificationResponse?.rows[0]=>", updatePersistentVerificationResponse?.rows[0])
    return updatePersistentVerificationResponse?.rows[0];
  }else{
    const generate_password_query = `INSERT INTO verification (${verification_table?.UNIQUE_ID}, ${verification_table?.PURPOSE}, ${verification_table?.OTP}) VALUES($1, $2, $3)`;
    const newVerification = await db.query(generate_password_query, [unique_id, purpose, otp]);
    // console.log("newVerification?.rows[0]=>>", newVerification?.rows[0]);
    return newVerification?.rows[0];
  }
}

module.exports = createOTPVarification;