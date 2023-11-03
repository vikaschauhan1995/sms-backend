const { v4: uuidv4 } = require('uuid');
const users = require('../constants/users_table');
const student = require('../constants/student_table');
const db = require('../db');
const { createUser } = require('./usersController');


const createStudent = async (req, res) => {
  try {
    const { first_name, last_name, class_, section, gender, dob, roll_number, admission_number, religion, email, username, father_name, mother_name, father_occupation, mother_occupation, mobile_number, nationality, present_address, permanent_address, is_active } = req.body;
    const { user_id } = req.params;
    if (!first_name || !last_name || !class_ || !section || !gender || !dob || !roll_number || !admission_number || !religion || !email || !username || !father_name || !mother_name || !mobile_number || !nationality || !present_address || !permanent_address) {
      throw Error('All fields must be filled');
    }
    // !father_occupation || !mother_occupation
    const userQuery = `SELECT * FROM users WHERE (${users?.USER_ID} = $1 AND ${users?.USER_TYPE} = 'admin') OR (${users?.USER_ID} = $2 AND ${users?.USER_TYPE} = 'root') LIMIT 1`;
    const userObj = await db.query(userQuery, [user_id, user_id]);
    const user = userObj?.rows[0];
    if (!user) {
      throw Error("Creater not found");
    }
    const insertStudentQuery = `INSERT INTO student (${student.USER_ID}, ${student.SCHOOL_ID}, ${student.FIRST_NAME}, ${student.LAST_NAME}, ${student.CLASS_}, ${student.SECTION}, ${student.GENDER}, ${student.DOB}, ${student.ROLL_NUMBER}, ${student.ADMISSION_NUMBER}, ${student.RELIGION}, ${student.EMAIL}, ${student.USERNAME}, ${student.FATHER_NAME}, ${student.MOTHER_NAME}, ${student.FATHER_OCCUPATION}, ${student.MOTHER_OCCUPATION}, ${student.MOBILE_NUMBER}, ${student.NATIONALITY}, ${student.PRESENT_ADDRESS}, ${student.PERMANENT_ADDRESS}, ${student.IS_ACTIVE}) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *`;
    const newGeneratedStudentUserId = uuidv4();
    const insertStudentResponse = await db.query(insertStudentQuery, [newGeneratedStudentUserId, user?.[users?.SCHOOL_ID], first_name, last_name, class_, section, gender, dob, roll_number, admission_number, religion, email, username, father_name, mother_name, father_occupation, mother_occupation, mobile_number, nationality, present_address, permanent_address, is_active]);
    const newStudent = insertStudentResponse?.rows[0];
    if (!newStudent) {
      throw Error('New student could not be created');
    }
    if (newStudent) {
      const newUserId = await createUser(newStudent?.[student?.USERNAME], newStudent?.[student?.EMAIL], "student", newStudent?.[student?.SCHOOL_ID], newStudent?.[student?.USER_ID]);
      res.status(200).json({ user_id: newUserId });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getAllStudentsByUserType = async (req, res) => {
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
      query = `SELECT * FROM student WHERE ${student?.SCHOOL_ID} = $1 ORDER BY ${student?.CREATED_ON} DESC`;
      queryResponse = await db.query(query, [currentUser?.[users?.SCHOOL_ID]]);
    } else if (currentUser?.[users.USER_TYPE] === "root") {
      query = `SELECT * FROM student WHERE ORDER BY ${student?.CREATED_ON} DESC`;
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

const getStudent = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      throw Error("Couldn't find the student's user id");
    }
    const selectQuery = `SELECT * FROM student WHERE ${student?.USER_ID} = $1`;
    const selectQueryResponse = await db.query(selectQuery, [user_id]);
    const studentObj = selectQueryResponse?.rows[0];
    if (!studentObj) {
      throw Error("Could't find the the student");
    }
    res.status(200).json(studentObj);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const updateStudent = async (req, res) => {
  try {
    const { first_name, last_name, class_, section, gender, dob, roll_number, admission_number, religion, email, username, father_name, mother_name, father_occupation, mother_occupation, mobile_number, nationality, present_address, permanent_address, is_active } = req.body;
    const { user_id } = req.params;
    if (!first_name || !last_name || !class_ || !section || !gender || !dob || !roll_number || !admission_number || !religion || !email || !username || !father_name || !mother_name || !mobile_number || !nationality || !present_address || !permanent_address) {
      throw Error('All fields must be filled');
    }
    const updateQuery = `UPDATE student SET
    ${student?.FIRST_NAME} = $1, 
    ${student?.LAST_NAME} = $2, 
    ${student?.CLASS_} = $3, 
    ${student?.SECTION} = $4, 
    ${student?.GENDER} = $5, 
    ${student?.DOB} = $6, 
    ${student?.ROLL_NUMBER} = $7, 
    ${student?.ADMISSION_NUMBER} = $8, 
    ${student?.RELIGION} = $9, 
    ${student?.EMAIL} = $10, 
    ${student?.USERNAME} = $11, 
    ${student?.FATHER_NAME} = $12, 
    ${student?.MOTHER_NAME} = $13, 
    ${student?.FATHER_OCCUPATION} = $14, 
    ${student?.MOTHER_OCCUPATION} = $15, 
    ${student?.MOBILE_NUMBER} = $16, 
    ${student?.NATIONALITY} = $17, 
    ${student?.PRESENT_ADDRESS} = $18, 
    ${student?.PERMANENT_ADDRESS} = $19, 
    ${student?.IS_ACTIVE} = $20
    WHERE ${student?.USER_ID} = $21 RETURNING *`;
    const updateQueryResponse = await db.query(updateQuery, [first_name, last_name, class_, section, gender, dob, roll_number, admission_number, religion, email, username, father_name, mother_name, father_occupation, mother_occupation, mobile_number, nationality, present_address, permanent_address, is_active, user_id]);
    const updatedStudent = updateQueryResponse?.rows[0];
    if (!updatedStudent) {
      throw Error("Coundn't get the updated student");
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


const deleteStudent = async (req, res) => {
  try {
    const { user_id } = req.params;
    const deleteStudentQuery = `DELETE FROM student WHERE ${student?.USER_ID} = $1 RETURNING *`;
    const deleteUserQuery = `DELETE FROM users WHERE ${users?.USER_ID} = $1 RETURNING *`;

    const deleteStudentQueryResponse = await db.query(deleteStudentQuery, [user_id]);
    const deleteUserQueryResponse = await db.query(deleteUserQuery, [user_id]);

    const deletedStudent = deleteStudentQueryResponse?.rows[0];
    const deletedUser = deleteUserQueryResponse?.rows[0];
    if (!deletedStudent || !deletedUser) {
      throw Error("Couldn't find deleted student and delete user data");
    }
    res.status(200).json({ student: deletedStudent, user: deletedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


module.exports = {
  createStudent,
  getAllStudentsByUserType,
  getStudent,
  updateStudent,
  deleteStudent
};