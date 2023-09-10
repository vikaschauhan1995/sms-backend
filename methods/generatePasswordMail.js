
const createTokenForObject = require('./createTokenForObject');

const generatePasswordMail = async (email, user_id, otp) => {
  try {
    const token = createTokenForObject({ user_id, otp });
    // send this token to mail with url looks like 12.122.43.55:8010/generate_password/${token}
    console.log(`/generate_password/${token}`);
  } catch (error) {
    console.log("Error: " + error.message);
  }
}

module.exports = generatePasswordMail;