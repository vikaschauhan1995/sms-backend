const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const users = require('../constants/users_table');
const { verification_table, CREATE_USER } = require('../constants/verification_table');
const db = require('../db.js')
const generatePasswordMail = require('../methods/generatePasswordMail');
const generateOTP = require('../methods/generateOTP');
const validateEmail = require('../utility/validateEmail');
const validateUsername = require('../utility/validateUsername');
const users_table = require('../constants/users_table');
const getObjectFromToken = require('../methods/getObjectFromToken.js');
const teacher_table = require('../constants/teacher_table.js');
const { deleteVerification, getVerification } = require('../methods/verificationMethods.js');
const { getTeacherById } = require('../methods/teacher_methods/getTeacherById.js');
const { setUsernameByTeacherId } = require('../methods/teacher_methods/setUsernameByTeacherId.js');
const { getUserObjFromUsername } = require('../methods/users_methods/getUserObjFromUsername.js');
const { createUserByGivenAllDetails } = require('../methods/users_methods/createUserByGivenAllDetails.js');
const { getAdminByAdminId } = require('../methods/admin_methods/getAdminByAdminId.js');
const admin_table = require('../constants/admin_table.js');
const { setUsernameByAdminId } = require('../methods/admin_methods/setUsernameByAdminId.js');
const { getStudentObjByStudentId } = require('../methods/student_methods/getStudentObjByStudentId.js');
const student_table = require('../constants/student_table.js');
const { setUsernameByStudentId } = require('../methods/student_methods/setUsernameByStudentId.js');
const { getUserObjectsByEmail } = require('../methods/users_methods/getUserObjectsByEmail.js');
const createOTPVarification = require('../methods/createOTPVarification.js');
const { CHANGE_PASSWORD } = require('../constants/auth_constants.js');
const createTokenForObject = require('../methods/createTokenForObject.js');
const sendMail = require('../methods/sendMail.js');

const getUserObjByUserId = async (user_id) => {
  const query = `SELECT id, ${users.USER_ID}, ${users.SCHOOL_ID}, ${users.EMAIL}, ${users.USERNAME}, ${users.USER_TYPE}, ${users.CREATED_ON}, ${users.LAST_LOGIN} FROM users WHERE ${users.USER_ID} = $1 LIMIT 1`;
  const usersArray = await db.query(query, [user_id]);
  return usersArray.rows[0];
}

const getUsersBySchool = async (req, res) => {
  const { school_id } = req.params;
  if (!school_id) {
    throw Error("School id is not available");
  }
  try {
    const query = `SELECT id, ${users.USER_ID}, ${users.SCHOOL_ID}, ${users.EMAIL}, ${users.USERNAME}, ${users.USER_TYPE}, ${users.CREATED_ON}, ${users.LAST_LOGIN} FROM users WHERE ${users.SCHOOL_ID} = $1`;
    const usersArray = await db.query(query, [school_id]);
    res.status(200).json(usersArray.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


const getAllUsers = async (req, res) => {
  try {
    const query = `SELECT id, ${users.USER_ID}, ${users.SCHOOL_ID}, ${users.EMAIL}, ${users.USERNAME}, ${users.USER_TYPE}, ${users.CREATED_ON}, ${users.LAST_LOGIN} FROM users`;
    const userList = await db.query(query);
    res.status(200).json(userList.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const getUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    if (!user_id) {
      throw Error(`${users.USER_ID} is not available`);
    }
    const query = `SELECT id, ${users.USER_ID}, ${users.SCHOOL_ID}, ${users.EMAIL}, ${users.USERNAME}, ${users.USER_TYPE}, ${users.CREATED_ON}, ${users.LAST_LOGIN} FROM users WHERE ${users.USER_ID} = $1`;
    const user = await db.query(query, [user_id]);
    res.status(200).json(user.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const updateUser = async (req, res) => {
  const { username, email, user_type } = req.body;
  const { user_id } = req.params;
  try {
    if (!username || !email || !user_type) {
      throw Error('All field must be filled');
    }
    if (!user_id) {
      throw Error(`${users.USER_ID} is not available`);
    }
    if (validateUsername(username) === false) {
      throw Error("Username accepts underscore and 3-20 characters long");
    }
    if (validateEmail(email) === false) {
      throw Error("Email is not valid");
    }
    const query = `UPDATE users SET
      ${users.USERNAME} = $1,
      ${users.EMAIL} = $2,
      ${users.USER_TYPE} = $3
      WHERE ${users.USER_ID} = $4
      RETURNING id, ${users.USER_ID}, ${users.SCHOOL_ID}, ${users.EMAIL}, ${users.USERNAME}, ${users.USER_TYPE}, ${users.CREATED_ON}, ${users.LAST_LOGIN}`;
    const updatedUser = await db.query(query, [username, email, user_type, user_id]);
    res.status(200).json(updatedUser.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const deleteUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    if (!user_id) {
      throw Error(`${users.USER_ID} is not available`);
    }
    const query = `DELETE FROM users WHERE ${users.USER_ID} = $1 RETURNING id, ${users.USER_ID}, ${users.SCHOOL_ID}, ${users.EMAIL}, ${users.USERNAME}, ${users.USER_TYPE}, ${users.CREATED_ON}, ${users.LAST_LOGIN}`;
    const deletedUser = await db.query(query, [user_id]);
    res.status(200).json(deletedUser.rows?.[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


const createUserByUsernameAndPassword = async (req, res) => {
  try {
    const { username, password, token } = req.body;
    if (!username) throw Error("Username field is empty");
    if (!password) throw Error("Password field is empty");
    if (!token) throw Error("Token is required");
    const isUsernameValid = validateUsername(username);
    if (!isUsernameValid) throw Error("Username is not valid")
    const user = await getUserObjFromUsername(username);
    if (user?.[users_table?.USERNAME]) throw Error("Username is already taken");
    const tokenObject = getObjectFromToken(token);
    if (!tokenObject) throw Error("Token is not valid");

    const unique_id = tokenObject?.[verification_table?.UNIQUE_ID];
    const purpost = tokenObject?.[verification_table?.PURPOSE];
    const otp = tokenObject?.[verification_table?.OTP];
    const getVerificationObject = await getVerification(unique_id, purpost, otp);
    if (!getVerificationObject) throw Error("Token Verification failed");

    const verificationUniqueId = tokenObject?.[verification_table?.UNIQUE_ID];
    const verificationPurpose = tokenObject?.[verification_table?.PURPOSE];
    const user_type = tokenObject?.[users_table?.USER_TYPE];
    if (verificationPurpose !== CREATE_USER) throw Error("Verification purpose is not valid");
    if (user_type === "teacher") {
      const teacher = await getTeacherById(verificationUniqueId);
      if (!teacher) throw Error("Couldn't find teacher");
      const school_id = teacher?.[teacher_table?.SCHOOL_ID];
      const email = teacher?.[teacher_table?.EMAIL];
      const teacher_id = teacher?.[teacher_table?.TEACHER_ID];
      const updatedTeacher = await setUsernameByTeacherId(teacher_id, username);
      if (!updatedTeacher) throw Error("Couldn't set username to teacher");
      const createdUser = await createUserByGivenAllDetails(school_id, email, username, password, user_type);
      if (!createdUser) throw Error("Couldn't find created user");
      await deleteVerification(verificationUniqueId, verificationPurpose);
      res.status(200).json(createdUser);
    } if(user_type === "admin"){
      const admin = await getAdminByAdminId(verificationUniqueId);
      if(!admin) throw Error("Couldn't find admin")
      const school_id = admin?.[admin_table?.SCHOOL_ID];
      const email = admin?.[admin_table?.EMAIL];
      const admin_id = admin?.[admin_table?.ADMIN_ID];
      const updatedAdmin = await setUsernameByAdminId(admin_id, username);
      if(!updatedAdmin) throw Error("Couldn't set username to admin");
      const createdUser = await createUserByGivenAllDetails(school_id, email, username, password, user_type);
      if (!createdUser) throw Error("Couldn't find created user");
      await deleteVerification(verificationUniqueId, verificationPurpose);
      res.status(200).json(createdUser);
    } if(user_type === "student"){
      const student = await getStudentObjByStudentId(verificationUniqueId);
      if(!student) throw Error("Couldn't find student");
      const school_id = student?.[student_table?.SCHOOL_ID];
      const email = student?.[student_table?.EMAIL];
      const student_id = student?.[student_table?.STUDENT_ID];
      const updatedStudent = await setUsernameByStudentId(student_id, username);
      if(!updatedStudent) throw Error("Couldn't set username to student");
      const createdUser = await createUserByGivenAllDetails(school_id, email, username, password, user_type);
      if (!createdUser) throw Error("Couldn't find created user");
      await deleteVerification(verificationUniqueId, verificationPurpose);
      res.status(200).json(createdUser);
    } else {
      throw Error("Couldn't create user");
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(400).json({ error: error.message });
    }
  }
}

const getUsersByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      throw Error("User type not specified");
    }
    if (validateEmail(email) === false) {
      throw Error("Email is not valid");
    }
    const users = await getUserObjectsByEmail(email);
    if(users?.length !== 0){
      res.status(200).json(users);
    }else{
      res.status(400).json({ error: "No user found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const forgetPasswordRequest = async (req, res) => {
  try {
    const { username } = req.params;
    if(!username) throw Error("Username is not specified");
    if(validateUsername(username) === false) throw Error("Username is not valid");
    const user = await getUserObjFromUsername(username);
    if(!user) throw Error("Can't find user");
    const varification = await createOTPVarification(user?.[users_table?.USER_ID], CHANGE_PASSWORD);
    if(!varification) throw Error("Couldn't create otp variable");

    const otpToken = await createTokenForObject(varification)

    const sendTo = user?.[users_table?.EMAIL];
    const subject = 'Forget Password Request';
    const body = `Click this link to Go on the reset password page
      ${process.env.FRONT_END_URL}/reset_password/${otpToken}
      And this link only be used within 24 hours
    `;
    await sendMail(sendTo, subject, body);

    res.status(200).json({ message: "Mail sent to your email address and it will expire within 24 hours" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const changePassword = async (req, res) => {
  try{
    const { password, token } = req?.body;
    if(!token) throw Error("Token is not provided");
    if(!password) throw Error("Please enter password");
    if(password?.length < 4 || password?.length > 16) {
      throw Error("Password must be between 4 and 16 characters long");
    }
    const verificationObj = await getObjectFromToken(token);
    if(!verificationObj) throw Error('Token verification failed');
    if(verificationObj?.[verification_table?.PURPOSE] !== CHANGE_PASSWORD) throw Error("Token verification failed to purpose of change password");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const updateQuery = `UPDATE users SET ${users_table?.PASSWORD} = $1 WHERE ${users_table?.USER_ID} = $2 RETURNING *`;
    const updateResponse = await db.query(updateQuery, [hash, verificationObj?.[verification_table?.UNIQUE_ID]]);
    // console.log("updateResponse=>", updateResponse?.rows);
    if(!updateResponse) throw Error("Password couldn't be updated");
    const removeVerificationQuery = `DELETE FROM verification WHERE ${verification_table?.UNIQUE_ID} = $1 AND ${verification_table?.PURPOSE} = $2 RETURNING *`;
    const removeVerificationResponse = await db.query(removeVerificationQuery, [verificationObj?.[verification_table?.UNIQUE_ID], verificationObj?.[verification_table?.PURPOSE]]);
    if(!removeVerificationResponse) throw Error("Couldn't delete OTP verfication");
    res.status(200).json({ message: "Password Updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getUserObjByUserId,
  getUsersBySchool,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  createUserByUsernameAndPassword,
  getUsersByEmail,
  forgetPasswordRequest,
  changePassword
}