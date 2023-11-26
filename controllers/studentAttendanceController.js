const student_table = require("../constants/student_table");
const { saveStudentAttendance } = require("../methods/student_attendance_methods/saveStudentAttendance");
const { getStudentObjByStudentId } = require("../methods/student_methods/getStudentObjByStudentId");



const getStudentAttendanceOfClass = async (req, res) => {
  try{
    // res.status(200).json(sessionYears);
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
    const savedStudentAttendance = await saveStudentAttendance(school_id, class_id, user_id, student_id, is_present);
    res.status(200).json(savedStudentAttendance);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}


module.exports = {
  getStudentAttendanceOfClass,
  postStudentAttendance
}