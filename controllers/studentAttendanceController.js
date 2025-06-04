const student_table = require("../constants/student_table");
const { getAttendanceOfAStudent } = require("../methods/student_attendance_methods/getAttendanceOfAStudent");
const { getStudentsOfClassAttendanceByCreatedDate } = require("../methods/student_attendance_methods/getStudentsOfClassAttendanceByCreatedDate");
const { saveStudentAttendance } = require("../methods/student_attendance_methods/saveStudentAttendance");
const { saveStudentAttendanceByCreatedDate } = require("../methods/student_attendance_methods/saveStudentAttendanceByCreatedDate");
const { updateAttendanceOfStudent } = require("../methods/student_attendance_methods/updateAttendanceOfStudent");
const { getStudentObjByStudentId } = require("../methods/student_methods/getStudentObjByStudentId");
const getTodaysDate = require("../utility/getTodaysDate");
const classes_table = require("../constants/classes_table");
const { classAttendanceOfRange } = require("../methods/class_attendance_methods/classAttendanceOfRange");
const { getClassObjById } = require("../methods/classes_methods/getClassById");
const { getStudentAttendanceByCreatedDate } = require("../methods/student_attendance_methods/getStudentAttendanceByCreatedDate");
const db = require("../db");


const getTodaysAttendanceOfClassStudent = async (req, res) => {
  try{
    const { school_id } = req?.user;
    const { class_id } = req?.params;
    const todays_date = getTodaysDate();
    const studentAttendanceList = await getStudentsOfClassAttendanceByCreatedDate(school_id, class_id, todays_date);
    res.status(200).json(studentAttendanceList);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

const postStudentAttendance = async (req, res) => {
  try{
    const { school_id, user_id } = req?.user;
    const { student_id, is_present } = req?.body;
    if(!student_id) throw Error('Student id is not provided');
    if(is_present !== true && is_present !== false) throw Error("Attendance must be boolean");
    const student = await getStudentObjByStudentId(student_id);
    if(!student) throw Error("Couldn't find student in database");
    if(student?.[student_table?.SCHOOL_ID] !== school_id) throw Error("Student doesn't belong to this school");

    const class_id = student?.[student_table?.CLASS_ID];
    const todays_date = getTodaysDate();
    const attendanceOfStudent = await getAttendanceOfAStudent(student_id, todays_date);
    if(attendanceOfStudent){
      const updatedAttendance = await updateAttendanceOfStudent(student_id, todays_date, is_present);
      res.status(200).json(updatedAttendance);
    }else{
      const savedStudentAttendance = await saveStudentAttendance(school_id, class_id, user_id, student_id, is_present);
      res.status(200).json(savedStudentAttendance);
    }
  }catch(error){
    if (!res.headersSent) {
      res.status(400).json({ error: error.message });
    }
  }
}

const postStudentAttendanceByDate = async (req, res) => {
  try {
    const { school_id, user_id } = req?.user;
    const { student_id, is_present, created_date } = req?.body;
    if(!student_id) throw Error('Student Id is required');
    if(typeof is_present !== 'boolean') throw Error('Student Attendance is_present must be a boolean');
    if(!created_date) throw Error('Student Attendance created date is required');
    const student = await getStudentObjByStudentId(student_id);
    if(!student) throw Error('Student not found in our database');
    const class_id_of_student = student?.[student_table?.CLASS_ID];
    const studentAttendance = await getStudentAttendanceByCreatedDate(student_id, created_date);
    if(studentAttendance) {
      const updatedAttendance = await updateAttendanceOfStudent(student_id, created_date, is_present);
      res.status(200).json(updatedAttendance);
    }else {
      const savedStudentAttendance = await saveStudentAttendanceByCreatedDate(school_id, class_id_of_student, user_id, created_date, student_id, is_present);
      res.status(200).json(savedStudentAttendance);
    }
  } catch(error) {
    if (!res.headersSent) {
      res.status(400).json({ error: error.message });
    }
  }
}

const getMyAttendanceOfMonth = async (req, res) => {
  try {
    const { user_id } = req?.user;
    const { month, year } = req.params;
    const attendanceQuery = `SELECT 
    id, 
    student_id, 
    class_id, 
    school_id, 
    created_by, 
    is_present, 
    comment, 
    created_date::text,
    created_on
    FROM student_attendance WHERE student_id = $1
    AND created_date >= '${year}-${month}-01' 
    AND created_date < '${year}-${parseInt(month)+1}-01' ORDER BY created_date`;

    const attendanceRow = await db.query(attendanceQuery, [user_id]);
    res.status(200).json(attendanceRow.rows);
  } catch(error) {
    if (!res.headersSent) {
      res.status(400).json({ error: error.message });
    }
  }
}

const getClassAttendanceOfMonth = async (req, res) => {
  try {
    const { user_id, school_id } = req?.user;

    const { class_id, month, year } = req.params;

    const classObj = await getClassObjById(class_id);
    if(!classObj) throw Error('Class id is not valid');
    if(classObj?.[classes_table?.SCHOOL_ID] !== school_id) throw Error('Class Id does not belong to your school');
    
    // Validate month and year
    if (isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: 'Invalid month. Must be between 1 and 12' });
    }
    
    if (isNaN(year) || year.length !== 4) {
      return res.status(400).json({ error: 'Invalid year. Must be 4 digits' });
    }
    
    // Format month to always be 2 digits
    const formattedMonth = month.toString().padStart(2, '0');
    
    // First, get all students in the class
    const studentsQuery = `
      SELECT id, student_id, first_name, last_name, roll_number 
      FROM student 
      WHERE class_id = $1
      ORDER BY roll_number ASC
    `;

    const studentsResult = await db.query(studentsQuery, [class_id]);
    const students = studentsResult.rows;
    
    if (students.length === 0) {
      return res.status(404).json({ error: 'No students found for this class' });
    }
    
    // Get attendance for all students in the specified month
    const attendanceQuery = `
      SELECT 
        sa.student_id,
        sa.is_present,
        sa.created_date::text,
        s.first_name,
        s.last_name,
        s.roll_number
      FROM student_attendance sa
      JOIN student s ON sa.student_id = s.student_id
      WHERE 
        sa.class_id = $1 AND
        EXTRACT(MONTH FROM sa.created_date) = $2 AND
        EXTRACT(YEAR FROM sa.created_date) = $3
      ORDER BY s.roll_number ASC, sa.created_date ASC
    `;
    
    const attendanceResult = await db.query(attendanceQuery, [class_id, formattedMonth, year]);
    const attendanceRecords = attendanceResult.rows;
    
    // Organize the data by student
    const responseData = students.map(student => {
      const studentAttendance = attendanceRecords
        .filter(record => record.student_id === student.student_id)
        .map(record => ({
          date: record?.created_date,
          is_present: record?.is_present
        }));
      
      return {
        student_id: student?.student_id,
        first_name: student?.first_name,
        last_name: student?.last_name,
        roll_number: student?.roll_number,
        attendance: studentAttendance
      };
    });
    
    res.json({
      class_id,
      month: formattedMonth,
      year,
      students: responseData
    });
    
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  // try{
  //   // console.log('school_id, created_year==>');
  //   const { user_id, school_id } = req?.user;
  //   const { year, class_id, month } = req?.params;
  //   if(!year) throw Error('Session year is required');
  //   if(!class_id) throw Error('Class id is required');
  //   if(!month) throw Error('Month is required');

  //   const classObj = await getClassObjById(class_id);
  //   if(!classObj) throw Error('Class id is not valid');
  //   if(classObj?.[classes_table?.SCHOOL_ID] !== school_id) throw Error('Class Id does not belong to your school');

  //   const start_date = year + '-' + month + '-01';
  //   const end_date = (month >= 12 ? parseInt(year) + 1 : year) + '-' + (month >= 12 ? '01' : parseInt(month) + 1) + '-01';

  //   const attendanceList = await classAttendanceOfRange(class_id, start_date, end_date);

  //   res.status(200).json(attendanceList);
  // }catch(error){
  //   res.status(400).json({ error: error.message });
  // }
}


const getStudentAttendanceSummary = async (req, res) => {
  try {
    const { school_id } = req?.user;
    const { year } = req.params;
    if (!school_id) throw Error('School Id is required')
    const query = `SELECT
        s.school_id,
        c.class_name,
        c.section,
        COUNT(s.student_id) AS total_students_in_class,
        SUM(CASE WHEN sa.is_present = TRUE THEN 1 ELSE 0 END) AS present_students_count,
        SUM(CASE WHEN sa.is_present = FALSE THEN 1 ELSE 0 END) AS absent_students_count,
        SUM(CASE WHEN sa.id IS NULL THEN 1 ELSE 0 END) AS no_record_students_count
      FROM
        classes c
      JOIN
        student s ON c.id = s.class_id AND c.school_id = s.school_id
      LEFT JOIN
        student_attendance sa ON s.student_id = sa.student_id
                            AND sa.school_id = c.school_id
                            AND sa.created_date = CURRENT_DATE
      WHERE
        c.school_id = $1
        AND c.created_year = $2
      GROUP BY
        s.school_id,
        c.class_name,
        c.section
      ORDER BY
        c.class_name,
        c.section;`;
      const response = await db.query(query, [school_id, year]);
      res.status(200).json(response.rows);
  } catch (error) {
    if (!res.headersSent) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = {
  getTodaysAttendanceOfClassStudent,
  postStudentAttendance,
  getClassAttendanceOfMonth,
  postStudentAttendanceByDate,
  getMyAttendanceOfMonth,
  getStudentAttendanceSummary
}