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

const getClassAttendanceOfMonth = async (req, res) => {
  try{
    // console.log('school_id, created_year==>');
    const { user_id, school_id } = req?.user;
    const { year, class_id, month } = req?.params;
    if(!year) throw Error('Session year is required');
    if(!class_id) throw Error('Class id is required');
    if(!month) throw Error('Month is required');

    const classObj = await getClassObjById(class_id);
    if(!classObj) throw Error('Class id is not valid');
    if(classObj?.[classes_table?.SCHOOL_ID] !== school_id) throw Error('Class Id does not belong to your school');

    const start_date = year + '-' + month + '-01';
    const end_date = (month >= 12 ? parseInt(year) + 1 : year) + '-' + (month >= 12 ? '01' : parseInt(month) + 1) + '-01';

    const attendanceList = await classAttendanceOfRange(class_id, start_date, end_date);

    res.status(200).json(attendanceList);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}


module.exports = {
  getTodaysAttendanceOfClassStudent,
  postStudentAttendance,
  getClassAttendanceOfMonth,
  postStudentAttendanceByDate
}