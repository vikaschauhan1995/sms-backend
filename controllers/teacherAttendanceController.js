const teacher_attendance_table = require("../constants/teacher_attendance_table");
const db = require("../db");
const getTodaysDate = require("../utility/getTodaysDate")

const updateTeacherAttendance = async () => {

}

const postTeacherAttendance = async (req, res) => {
  try {
    // const { school_id } = req?.params;
    const { teacher_id, school_id, created_by, created_date, is_present, comment } = req?.body;
    let comment_ = '';
    // console.log("req.body=>",req.body);
    if (!teacher_id || !school_id || !created_by || typeof is_present != "boolean" || !created_date) {
      throw Error("Body data is incomplete");
    }
    
    const checkTeacherAttendanceAlreadyExists = `SELECT * FROM teacher_attendance WHERE ${teacher_attendance_table?.CREATED_BY} = $1 AND ${teacher_attendance_table?.TEACHER_ID} = $2 AND ${teacher_attendance_table?.CREATED_DATE} = $3`;
    const todaysDate = getTodaysDate();
    const checkTeacherAttendanceAlreadyExistsResponse = await db.query(checkTeacherAttendanceAlreadyExists, [created_by, teacher_id, created_date]);
    
    if(checkTeacherAttendanceAlreadyExistsResponse.rows.length > 0){
      return await updateTeacherAttendanceController(req, res);
    }

    const addAttendanceQuery = `INSERT INTO teacher_attendance(${teacher_attendance_table?.TEACHER_ID}, ${teacher_attendance_table?.SCHOOL_ID}, ${teacher_attendance_table?.CREATED_BY}, ${teacher_attendance_table?.IS_PRESENT}, ${teacher_attendance_table?.COMMENT}) VALUES($1, $2, $3, $4, $5) RETURNING *`;
    const addAttendanceQueryResponse = await db.query(addAttendanceQuery, [teacher_id, school_id, created_by, is_present, comment_]);
    res.status(200).json(addAttendanceQueryResponse?.rows?.[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


const updateTeacherAttendanceController = async (req, res) => {
  try {
    // console.log("you are in update=>", req?.params);
    const { teacher_id, school_id, created_by, created_date, is_present, comment } = req?.body;
    const comment_  = '';
    if (!teacher_id || !school_id || !created_by || !created_date || typeof is_present != "boolean") {
      throw Error("Body data update is incomplet");
    }
    
    const updateTeacherAttendanceQuery = `UPDATE teacher_attendance SET
      ${teacher_attendance_table?.TEACHER_ID} = $1,
      ${teacher_attendance_table?.CREATED_BY} = $2,
      ${teacher_attendance_table?.IS_PRESENT} = $3,
      ${teacher_attendance_table?.COMMENT} = $4
    WHERE 
      ${teacher_attendance_table?.TEACHER_ID} = $5 AND
      ${teacher_attendance_table?.CREATED_BY} = $6 AND
      ${teacher_attendance_table?.SCHOOL_ID} = $7 AND
      ${teacher_attendance_table?.CREATED_DATE} = $8 RETURNING *`;
    // console.log("updateTeacherAttendanceQuery=>",updateTeacherAttendanceQuery);
    const todaysDate = getTodaysDate();
    const updateTeacherAttendanceQueryResponse = await db.query(updateTeacherAttendanceQuery, [teacher_id, created_by, is_present, comment_, teacher_id, created_by, school_id, created_date]);
    res.status(200).json(updateTeacherAttendanceQueryResponse?.rows?.[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getTeacherAttendanceByDateAndSchoolId = async (req, res) => {
  try{
    const { school_id, created_date } = req?.params;
    console.log("school_id, created_date=>>",school_id, created_date);
    if(!school_id){
      throw Error("School Id is not defined");
    }
    if(!created_date){
      throw Error("Created date is not provided");
    }
    const getTeacherListWithAttendanceQuery = `SELECT * FROM teacher_attendance WHERE ${teacher_attendance_table?.SCHOOL_ID} = $1 AND ${teacher_attendance_table?.CREATED_DATE} = $2`;
    const getTeacherListWithAttendanceResponse = await db.query(getTeacherListWithAttendanceQuery, [school_id, created_date]);
    res.status(200).json(getTeacherListWithAttendanceResponse?.rows);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

const getTeacherAttendanceOfMonth = async (req, res) => {
  try {
    const { school_id, YYYY, MM } = req.params;
    const S_YYYYMM = YYYY + '-' + MM + '-01';
    const L_YYYYMM = YYYY + '-' + (MM >= 12 ? '01' : parseInt(MM) + 1) + '-01';
    

    const getTeacherAttendanceQuery = `SELECT * FROM teacher_attendance WHERE ${teacher_attendance_table?.CREATED_DATE} >= $1 AND ${teacher_attendance_table?.CREATED_DATE} < $2 AND ${teacher_attendance_table?.SCHOOL_ID} = $3`;
    // const getTeacherAttendanceQuery_query = `SELECT * FROM teacher_attendance WHERE ${teacher_attendance_table?.CREATED_DATE} >= '${S_YYYYMM}' AND ${teacher_attendance_table?.CREATED_DATE} < '${L_YYYYMM}' AND ${teacher_attendance_table?.SCHOOL_ID} = '${school_id}'`;
    // console.log("getTeacherAttendanceQuery_query=>", getTeacherAttendanceQuery_query);
    const getTeacherAttendanceQueryResponse = await db.query(getTeacherAttendanceQuery, [S_YYYYMM, L_YYYYMM, school_id]);
    res.status(200).json(getTeacherAttendanceQueryResponse?.rows);
  } catch(error) {
    res.status(400).json({ error: error.message });
  }
}


module.exports = {
  postTeacherAttendance,
  updateTeacherAttendanceController,
  getTeacherAttendanceByDateAndSchoolId,
  getTeacherAttendanceOfMonth
};