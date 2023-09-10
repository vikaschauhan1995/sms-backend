
const generateOTP = (number) => {
  let otp = "";
  for (let x = 0; x < number; x++) {
    const random = Math.floor(Math.random() * 10);
    otp += random;
  }
  return parseInt(otp);
}

module.exports = generateOTP;