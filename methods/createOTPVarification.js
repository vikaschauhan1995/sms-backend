
const verification = require('../constants/verification_table');
const generateOTP = require('./generateOTP');
const db = require('../db.js')

const createOTPVarification = async (user_id, purpose) => {
  const generate_password_query = `INSERT INTO verification (${verification?.USER_ID}, ${verification?.PURPOSE}, ${verification?.OTP}) VALUES($1, $2, $3)`;
  const otp = generateOTP(6);
  const newVerification = await db.query(generate_password_query, [user_id, purpose, otp]);
  return newVerification?.rows[0];
}

module.exports = createOTPVarification;