const { v4: uuidv4 } = require('uuid');
const users = require('../constants/users_table');
const student = require('../constants/student_table');
const db = require('../db');
const { getUserObjByUserId } = require('./usersController');
const users_table = require('../constants/users_table');
const student_table = require('../constants/student_table');
const { getClassByIdAndCreatedBy } = require('./classesController');
const validateEmail = require('../utility/validateEmail');
const nodemailer = require('nodemailer');

const createStudent = async (req, res) => {
  try{
    const { created_by, first_name, last_name, class_id, dob, gender, roll_number, email, mobile_number } = req?.body;
    if(!first_name || !last_name || !class_id || !dob || !gender || !roll_number || !email || !mobile_number){
      throw Error("All fields must be filled");
    }
    if(!created_by){
      throw Error("Creater Id is required");
    }
    const user = await getUserObjByUserId(created_by);
    if(!user){
      throw Error("Creater Id is not valid");
    }
    const school_id = user?.[users_table?.SCHOOL_ID];
    if(!school_id){
      throw Error("School id is not available");
    }
    const class_ = await getClassByIdAndCreatedBy(class_id, created_by);
    if(!class_){
      throw Error("Class Id is not valid or belongs to you");
    }
    if(validateEmail(email) === false){
      throw Error("Email is not valid");
    }
    const student_id = uuidv4();
    const insertStudentQuery = `INSERT INTO student (${student_table?.STUDENT_ID}, ${student_table?.CREATED_BY}, ${student_table?.SCHOOL_ID}, ${student_table?.FIRST_NAME}, ${student_table?.LAST_NAME}, ${student_table?.CLASS_ID}, ${student_table?.DOB}, ${student_table?.GENDER}, ${student_table?.ROLL_NUMBER}, ${student_table?.EMAIL}, ${student_table?.MOBILE_NUMBER}) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;
    const insertStudentResponse = await db.query(insertStudentQuery, [student_id, created_by, school_id, first_name, last_name, class_id, dob, gender, roll_number, email, mobile_number]);
    res.status(200).json(insertStudentResponse?.rows[0]);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

const getStudentsByClassId = async (req, res) => {
  try{
    // console.log("req?.user?.user_id===>>>", req?.user?.user_id);
    const { class_id } = req.params;
    const created_by = req?.user?.user_id;
    if(!created_by) {
      throw Error("Created by is not available");
    }
    if(!class_id){
      throw Error("Class id is required");
    }
    const getStudentsByClassIdRequest = `SELECT * FROM student WHERE ${student_table?.CREATED_BY} = $1 AND ${student_table?.CLASS_ID} = $2 ORDER BY id DESC`;
    const getStudentsByClassIdResponse = await db.query(getStudentsByClassIdRequest, [created_by, class_id]);
    res.status(200).json(getStudentsByClassIdResponse?.rows);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

const updateStudentByStudentId = async (req, res) => {
  try{
    const { student_id } = req?.params;
    const { first_name, last_name, class_id, dob, gender, roll_number, email, mobile_number } = req?.body;
    if(!first_name || !last_name || !class_id || !dob || !gender || !roll_number || !email || !mobile_number){
      throw Error("All fields must be provided");
    }
    const updateStudentQuery = `UPDATE student SET
      ${student_table?.FIRST_NAME} = $1,
      ${student_table?.LAST_NAME} = $2,
      ${student_table?.CLASS_ID} = $3,
      ${student_table?.DOB} = $4,
      ${student_table?.GENDER} = $5,
      ${student_table?.ROLL_NUMBER} = $6,
      ${student_table?.EMAIL} = $7,
      ${student_table?.MOBILE_NUMBER} = $8
      WHERE ${student_table?.STUDENT_ID} = $9
      RETURNING *`;
      const updateStudentResponse = await db.query(updateStudentQuery, [first_name, last_name, class_id, dob, gender, roll_number, email, mobile_number, student_id]);
      res.status(200).json(updateStudentResponse.rows?.[0]);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

const deleteStudentByStudentId = async (req, res) => {
  try{
    const { student_id } = req?.params;
    if(!student_id){
      throw Error('Student id is not available');
    }
    const deleteStudentQuery = `DELETE FROM student WHERE ${student_table?.STUDENT_ID} = $1 RETURNING *`;
    const deleteStudentResponse = await db.query(deleteStudentQuery, [student_id]);
    res.status(200).json(deleteStudentResponse?.rows?.[0]);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

const sendMail = (req, res) => {
  try{
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email service provider (e.g., 'Gmail', 'Outlook', etc.)
      auth: {
        user: 'coolestvikas1995@gmail.com',
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });
    const mailOptions = {
      from: 'no-reply@sms.com',
      to: 'vikas.chauhan.bb@gmail.com',
      subject: 'Hello from Node.js!',
      text: 'This is a test email sent from Node.js with Nodemailer.',
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    res.status(200).json({ mail: "mail sent scucessfully"});;
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createStudent,
  getStudentsByClassId,
  updateStudentByStudentId,
  deleteStudentByStudentId,
  sendMail
  // getAllStudentsByUserType,
  // getStudent,
  // updateStudent,
  // deleteStudent
};