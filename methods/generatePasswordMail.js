const nodeMailer = require("nodemailer");
const createTokenForObject = require('./createTokenForObject');

const generatePasswordMail = async (email, user_id, otp) => {
  try {
    const token = createTokenForObject({ user_id, otp });

    // const testAccoutn = await nodeMailer.createTestAccount();
    // // 
    // const transporter = nodeMailer.createTransport({
    //   host: 'smtp.ethereal.email',
    //   port: 587,
    //   auth: {
    //     user: 'grover.oconnell@ethereal.email',
    //     pass: 'rNfdJEhueTZWxcaXQw'
    //   }
    // });

    // let info = await transporter.sendMail({
    //   from: '"SMS" <vikas>',
    //   to: "vikas.chauhan.bb@mail.com",
    //   subject: `Hello ${user_id}`,
    //   text: `Hello!! ${user_id}`,
    //   html: '<a href="' + process.env.FRONT_END_URL + '/generate_password" target="_blank">Generate Password</a>'
    // });


    // send this token to mail with url looks like 12.122.43.55:8010/generate_password/${token}
    console.log(`/generatePassword/${token}`);
  } catch (error) {
    console.log("Error: " + error.message);
  }
}

module.exports = generatePasswordMail;