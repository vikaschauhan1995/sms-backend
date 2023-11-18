const { v4: uuidv4 } = require('uuid');
const users = require('../constants/users_table');
const teacher = require('../constants/teacher_table');
const db = require('../db');
const { createUser } = require('../controllers/usersController');
const validateEmail = require('../utility/validateEmail');
const validateUsername = require('../utility/validateUsername');
const createOTPVarification = require('../methods/createOTPVarification');
const createTokenForObject = require('../methods/createTokenForObject');
const sendMail = require('../methods/sendMail');
const teacher_table = require('../constants/teacher_table');
const { CREATE_USER } = require('../constants/verification_table');
const users_table = require('../constants/users_table');
const { getTeacherById } = require('../methods/teacher_methods/getTeacherById');
const { deleteUserByUsername } = require('../methods/users_methods/deleteUserByUsername');

const createTeacher = async (req, res) => {
  try{
    const { first_name, last_name, gender, dob, email, mobile_number, address } = req.body;
    const { user_id, school_id } = req?.user;
    if(!user_id){
      throw Error("User id is not there!!");
    }
    if(!school_id){
      throw Error("School ID is not there!!");
    }
    if(!first_name || !last_name || !gender || !dob || !email || !mobile_number || !address){
      throw Error("All fields must be provided");
    }
    if(validateEmail(email) === false){
      throw Error("Email is not valid");
    }
    const teacher_id = uuidv4();
    const insertTeacherQuery = `INSERT INTO teacher (${teacher?.TEACHER_ID}, ${teacher?.SCHOOL_ID}, ${teacher?.FIRST_NAME}, ${teacher?.LAST_NAME}, ${teacher?.GENDER}, ${teacher?.DOB}, ${teacher?.EMAIL}, ${teacher?.MOBILE_NUMBER}, ${teacher?.ADDRESS}, ${teacher?.IS_ACTIVE}, ${teacher?.CREATED_BY}) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;
    const insertTeacherResponse = await db.query(insertTeacherQuery, [teacher_id, school_id, first_name, last_name, gender, dob, email, mobile_number, address, false, user_id]);
    res.status(200).json(insertTeacherResponse?.rows[0]);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

const getAllTeachersByUsertype = async (req, res) => {
  try {
    const { user_id } = req.params;
    const currentUserQuery = `SELECT * FROM users WHERE ${users?.USER_ID} = $1 LIMIT 1`;
    const currentUserResponse = await db.query(currentUserQuery, [user_id]);
    const currentUser = currentUserResponse?.rows[0];

    if (!currentUser?.[users.USER_TYPE]) {
      throw Error(`Got error while fetching ${users?.USER_TYPE}`);
    }

    let query;
    let queryResponse;
    if (currentUser?.[users.USER_TYPE] === "admin") {
      query = `SELECT * FROM teacher WHERE ${teacher?.SCHOOL_ID} = $1 ORDER BY ${teacher?.CREATED_ON} DESC`;
      queryResponse = await db.query(query, [currentUser?.[users?.SCHOOL_ID]]);
    } else if (currentUser?.[users.USER_TYPE] === "root") {
      query = `SELECT * FROM teacher WHERE ORDER BY ${teacher?.CREATED_ON} DESC`;
      queryResponse = await db.query(query, []);
    }

    const userList = queryResponse?.rows;
    if (!userList) {
      throw Error('User list is not there!');
    }
    res.status(200).json(userList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getTeacher = async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const teacherObj = await getTeacherById(teacher_id);
    res.status(200).json(teacherObj);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const updateTeacher = async (req, res) => {
  try {
    const { first_name, last_name, gender, dob, email, mobile_number, address } = req.body;
    const { user_id } = req?.user;
    const { teacher_id } = req.params;
    if(!user_id) throw Error("User id is not provided");
    if (!teacher_id) throw Error("Couldn't find the teacher's user id");
    if (!first_name || !last_name || !gender || !dob || !email || !mobile_number || !address) {
      throw Error("All fields must be filled");
    }
    if(validateEmail(email) === false){
      throw Error("email is not valid");
    }
    const updateQuery = `UPDATE teacher SET
    ${teacher?.FIRST_NAME} = $1,
    ${teacher?.LAST_NAME} = $2, 
    ${teacher?.GENDER} = $3, 
    ${teacher?.DOB} = $4, 
    ${teacher?.EMAIL} = $5, 
    ${teacher?.MOBILE_NUMBER} = $6, 
    ${teacher?.ADDRESS} = $7
    WHERE ${teacher?.TEACHER_ID} = $8 RETURNING *`;
    const updateQueryResponse = await db.query(updateQuery, [first_name, last_name, gender, dob,  email, mobile_number, address, teacher_id]);
    const updatedTeacher = updateQueryResponse?.rows[0];
    if (!updatedTeacher) {
      throw Error("Could't update the teacher");
    }
    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const deleteTeacher = async (req, res) => {
  try {
    const { teacher_id } = req.params;
    if(!teacher_id) {
      throw Error("Teacher id not specified");
    }
    const teacher = await getTeacherById(teacher_id);
    if(!teacher) throw Error("Teacher not found");
    const username = teacher?.[teacher_table?.USERNAME];
    if(username) {
      const deletedUser = await deleteUserByUsername(username);
      if(!deletedUser) throw Error("Couldn't delete teacher related user");
    }
    const deleteTeacherQuery = `DELETE FROM teacher WHERE ${teacher_table?.TEACHER_ID} = $1 RETURNING *`;
    const deleteTeacherQueryResponse = await db.query(deleteTeacherQuery, [teacher_id]);
    const deletedTeacher = deleteTeacherQueryResponse?.rows[0];
    if (!deletedTeacher) {
      throw Error("Couldn't find deleted teacher");
    }
    res.status(200).json({ teacher: deletedTeacher, user: deletedTeacher });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getAllTeachersBySchoolId = async (req, res) => {
  try{
    const { school_id } = req.params;
    if(!school_id){
      throw Error("School id is not available");
    }
    const allTeacherQuery = `SELECT * FROM teacher WHERE ${teacher?.SCHOOL_ID} = $1`;
    const allTeachersResponse = await db.query(allTeacherQuery, [school_id]);
    res.status(200).json(allTeachersResponse?.rows);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

const createTeacherUser = async (req, res) => {
  try{
    const { teacher_id } = req?.params;
    const teacherObj = await getTeacherById(teacher_id);
    if(!teacherObj) throw Error("Coundn't find teacher");
    const generatedOtpVerificationRespose = await createOTPVarification(teacher_id, CREATE_USER);
    if(!generatedOtpVerificationRespose) throw Error("Coundn't create OTP for verification")
    const generatedOtpObj = {
      ...generatedOtpVerificationRespose,
      [users_table?.USER_TYPE]: "teacher"
    };
    // console.log("generatedOtp=>>", generatedOtp);
    const otpToken = await createTokenForObject(generatedOtpObj);
    const sendTo = teacherObj?.[teacher_table?.EMAIL];
    const subject = "Create Account on SMS";
    const body = `Click this link to Create account
      ${process.env.FRONT_END_URL}/create_user/${otpToken}
    `;
    const mailResponse = await sendMail(sendTo, subject, body);
    // res.status(200).json({ message: mailResponse });
    // console.log("teacher_id=>>", teacher_id);
    res.status(200).json({ message: "mail sent" });
  }catch(error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createTeacher,
  getAllTeachersByUsertype,
  getTeacher,
  updateTeacher,
  deleteTeacher,
  getAllTeachersBySchoolId,
  createTeacherUser
}