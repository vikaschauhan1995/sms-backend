const { verification_table } = require("../../constants/verification_table");
const getObjectFromToken = require("../getObjectFromToken");
const { getVerification } = require("../verificationMethods");


const verifyTokenMethod = async (token) => {
  if(!token) throw Error('Token is required');
  const tokenObject = await getObjectFromToken(token);
  if(!tokenObject) throw Error('Token is invalid');
  const unique_id = tokenObject?.[verification_table?.UNIQUE_ID];
  const purpost = tokenObject?.[verification_table?.PURPOSE];
  const otp = tokenObject?.[verification_table?.OTP];
  const getVerificationObject = await getVerification(unique_id, purpost, otp);
  if(!getVerificationObject) throw Error("Token Verification failed");
  return tokenObject;
}

module.exports = {
  verifyTokenMethod
};