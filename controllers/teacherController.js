const { v4: uuidv4 } = require('uuid');
const users = require('../constants/users_table');
const teacher = require('../constants/teacher_table');
const db = require('../db');
const { createUser } = require('./usersController');

const createTeacher = async (req, res) => {
  try {
    const { first_name, last_name, class_, section, gender, dob, id_number, subject, religion, email, username, mobile_number, address, is_active } = req.body;
    const { user_id } = req.params;
    if (!first_name || !last_name || !class_ || !section || !gender || !dob || !id_number || !subject || !religion || !email || !username || !mobile_number || !address) {
      throw Error("All fields must be filled");
    }
    const checkIsTeacherUsernameAlreadyExists = `SELECT * FROM teacher WHERE ${teacher.USERNAME} = $1 LIMIT 1`;
    const checkIsTeacherUsernameAlreadyExistsReaponse = await db.query(checkIsTeacherUsernameAlreadyExists, [username]);
    if(checkIsTeacherUsernameAlreadyExistsReaponse?.rows.length > 0){
      throw Error("Teacher username already exists");
    }

    const userQuery = `SELECT * FROM users WHERE (${users?.USER_ID} = $1 AND ${users?.USER_TYPE} = 'admin') OR (${users?.USER_ID} = $2 AND ${users?.USER_TYPE} = 'root') LIMIT 1`;
    const userObj = await db.query(userQuery, [user_id, user_id]);
    const user = userObj?.rows[0];
    if (!user) {
      throw Error("Creater not found");
    }
    const insertTeacherQuery = `INSERT INTO teacher (${teacher.USER_ID}, ${teacher.SCHOOL_ID}, ${teacher.FIRST_NAME}, ${teacher.LAST_NAME}, ${teacher.CLASS_}, ${teacher.SECTION}, ${teacher.GENDER}, ${teacher.DOB}, ${teacher.ID_NUMBER}, ${teacher.SUBJECT}, ${teacher.RELIGION}, ${teacher.EMAIL}, ${teacher.USERNAME}, ${teacher.MOBILE_NUMBER}, ${teacher.ADDRESS}, ${teacher.IS_ACTIVE}) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`;
    const newGeneratedTeacherUserId = uuidv4();
    const runInsertTeacherQuery = await db.query(insertTeacherQuery, [newGeneratedTeacherUserId, user?.[users?.SCHOOL_ID], first_name, last_name, class_, section, gender, dob, id_number, subject, religion, email, username, mobile_number, address, is_active]);
    const newTeacher = runInsertTeacherQuery?.rows[0];
    if (!newTeacher) {
      throw Error('New teacher could not be created');
    }
    if (newTeacher) {
      const newUserId = await createUser(newTeacher?.[teacher?.USERNAME], newTeacher?.[teacher?.EMAIL], "teacher", newTeacher?.[teacher?.SCHOOL_ID], newTeacher?.[teacher?.USER_ID]);
    }
    res.status(200).json(newTeacher);
  } catch (error) {
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
    const { user_id } = req.params;
    if (!user_id) {
      throw Error("Couldn't find the teacher's user id");
    }
    const selectQuery = `SELECT * FROM teacher WHERE ${teacher?.USER_ID} = $1`;
    const selectQueryResponse = await db.query(selectQuery, [user_id]);
    const teacherObj = selectQueryResponse?.rows[0];
    // console.log("selectQueryResponse==>>", selectQueryResponse?.rows[0]);
    if (!teacherObj) {
      throw Error("Could't find the the teacher");
    }
    res.status(200).json(teacherObj);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const updateTeacher = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { first_name, last_name, class_, section, gender, dob, id_number, subject, religion, email, username, mobile_number, address, is_active } = req.body;
    if (!user_id) {
      throw Error("Couldn't find the teacher's user id");
    }
    // console.log("first_name, last_name, class_, section, gender, dob, id_number, subject, religion, email, username, mobile_number, address,=>", first_name, last_name, class_, section, gender, dob, id_number, subject, religion, email, username, mobile_number, address,);
    if (!first_name || !last_name || !class_ || !section || !gender || !dob || !id_number || !subject || !religion || !email || !username || !mobile_number || !address) {
      throw Error("All fields must be filled");
    }
    const updateQuery = `UPDATE teacher SET
    ${teacher?.FIRST_NAME} = $1, 
    ${teacher?.LAST_NAME} = $2, 
    ${teacher?.CLASS_} = $3, 
    ${teacher?.SECTION} = $4, 
    ${teacher?.GENDER} = $5, 
    ${teacher?.DOB} = $6, 
    ${teacher?.ID_NUMBER} = $7, 
    ${teacher?.SUBJECT} = $8, 
    ${teacher?.RELIGION} = $9, 
    ${teacher?.EMAIL} = $10, 
    ${teacher?.USERNAME} = $11, 
    ${teacher?.MOBILE_NUMBER} = $12, 
    ${teacher?.ADDRESS} = $13, 
    ${teacher?.IS_ACTIVE} = $14
    WHERE ${teacher?.USER_ID} = $15 RETURNING *`;
    const updateQueryResponse = await db.query(updateQuery, [first_name, last_name, class_, section, gender, dob, id_number, subject, religion, email, username, mobile_number, address, is_active, user_id]);
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
    const { user_id } = req.params;
    const deleteTeacherQuery = `DELETE FROM teacher WHERE ${teacher?.USER_ID} = $1 RETURNING *`;
    const deleteUserQuery = `DELETE FROM users WHERE ${users?.USER_ID} = $1 RETURNING *`;

    const deleteTeacherQueryResponse = await db.query(deleteTeacherQuery, [user_id]);
    const deleteUserQueryResponse = await db.query(deleteUserQuery, [user_id]);

    const deletedTeacher = deleteTeacherQueryResponse?.rows[0];
    const deletedUser = deleteUserQueryResponse?.rows[0];
    if (!deletedTeacher || !deletedUser) {
      throw Error("Couldn't find deleted teacher and delete user data");
    }
    res.status(200).json({ teacher: deletedTeacher, user: deletedUser });
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

module.exports = {
  createTeacher,
  getAllTeachersByUsertype,
  getTeacher,
  updateTeacher,
  deleteTeacher,
  getAllTeachersBySchoolId
}