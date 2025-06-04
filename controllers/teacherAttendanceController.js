const teacher_attendance_table = require("../constants/teacher_attendance_table");
const db = require("../db");
const { getTeacherAttendanceByCreatedDate } = require("../methods/teacher_attendance_methods/getTeacherAttendanceByCreatedDate");
const { saveTeacherAttendanceByCreatedDate } = require("../methods/teacher_attendance_methods/saveTeacherAttendanceByCreatedDate");
const { teacherAttendanceOfRange } = require("../methods/teacher_attendance_methods/teacherAttendanceOfRange");
const { updateAttendanceOfTeacher } = require("../methods/teacher_attendance_methods/updateAttendanceOfTeacher");
const { getTeacherById } = require("../methods/teacher_methods/getTeacherById");
const getTodaysDate = require("../utility/getTodaysDate")

const updateTeacherAttendance = async () => {

}

const postTeacherAttendance = async (req, res) => {
  try {
    // const { school_id } = req?.params;
    const { school_id, user_id: created_by } = req?.user;
    const { teacher_id, created_date, is_present, comment } = req?.body;
    let comment_ = '';
    if(!teacher_id) throw Error('Teacher id must be provided');
    if(typeof is_present != "boolean") throw Error('Teacher Attendance must be a boolean');
    if(!created_date) throw Error('Attendance date must be provided');
    
    const checkTeacherAttendanceAlreadyExists = `SELECT * FROM teacher_attendance WHERE ${teacher_attendance_table?.TEACHER_ID} = $1 AND DATE(${teacher_attendance_table?.CREATED_DATE}) = DATE($2)`;
    // const todaysDate = getTodaysDate();
    const checkTeacherAttendanceAlreadyExistsResponse = await db.query(checkTeacherAttendanceAlreadyExists, [teacher_id, created_date]);
    if(checkTeacherAttendanceAlreadyExistsResponse?.rows?.length > 0){
      const updatedAttendance = await updateAttendanceOfTeacher(teacher_id, created_date, is_present);
      res.status(200).json(updatedAttendance);
    }else {
      const savedTeacherAttendance = await saveTeacherAttendanceByCreatedDate(school_id, created_by, created_date, teacher_id, is_present);
      res.status(200).json(savedTeacherAttendance);
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(400).json({ error: error.message });
    }
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
    const { YYYY, MM } = req.params;
    const { school_id } = req?.user;

    const start_date = YYYY + '-' + MM + '-01';
    const end_date = (MM >= 12 ? parseInt(YYYY) + 1 : YYYY) + '-' + (MM >= 12 ? '01' : parseInt(MM) + 1) + '-01';
    const teacherAttendance = await teacherAttendanceOfRange(school_id, start_date, end_date);
    // console.log("teacherAttendance===>>", teacherAttendance);
    res.status(200).json(teacherAttendance);
  } catch(error) {
    res.status(400).json({ error: error.message });
  }
}

const postTeacherAttendanceByDate = async (req, res) => {
  try {
    const { school_id, user_id } = req?.user;
    const { teacher_id, is_present, created_date } = req?.body;
    if(!teacher_id) throw Error('Teacher Id is required');
    if(typeof is_present !== 'boolean') throw Error('Teacher Attendance is_present must be a boolean');
    if(!created_date) throw Error('Teacher Attendance created date is required');
    const teacher = await getTeacherById(teacher_id);
    if(!teacher) throw Error('Teacher not found in our database');
    const teacherAttendance = await getTeacherAttendanceByCreatedDate(teacher_id, created_date);
    if(teacherAttendance) {
      const updatedAttendance = await updateAttendanceOfTeacher(teacher_id, created_date, is_present);
      res.status(200).json(updatedAttendance);
    }else {
      const savedTeacherAttendance = await saveTeacherAttendanceByCreatedDate(school_id, user_id, created_date, teacher_id, is_present);
      res.status(200).json(savedTeacherAttendance);
    }
  } catch(error) {
    if (!res.headersSent) {
      res.status(400).json({ error: error.message });
    }
  }
}

const getTeacherAttendanceSummary = async (req, res) => {
  try {
    const { school_id } = req?.user;
    if (!school_id) throw Error('School Id is required')
    const query = `SELECT
        ta.school_id,
        SUM(CASE WHEN ta.is_present = TRUE THEN 1 ELSE 0 END) AS present_teachers_count,
        SUM(CASE WHEN ta.is_present = FALSE THEN 1 ELSE 0 END) AS absent_teachers_count,
        SUM(CASE WHEN ta.is_present = TRUE THEN 0 ELSE 1 END) AS not_available_teachers_count -- This is equivalent to absent_teachers_count if false means not available
      FROM
        teacher_attendance ta
      JOIN
        teacher t ON ta.teacher_id = t.teacher_id AND ta.school_id = t.school_id
      WHERE
        ta.school_id = $1 AND ta.created_date = CURRENT_DATE -- Replace 'YOUR_SCHOOL_ID' with the actual school ID
      GROUP BY
      ta.school_id;`;
      const response = await db.query(query, [school_id]);
      res.status(200).json(response.rows);
  } catch (error) {
    if (!res.headersSent) {
      res.status(400).json({ error: error.message });
    }
  }
};


module.exports = {
  postTeacherAttendance,
  updateTeacherAttendanceController,
  getTeacherAttendanceByDateAndSchoolId,
  getTeacherAttendanceOfMonth,
  postTeacherAttendanceByDate,
  getTeacherAttendanceSummary
};