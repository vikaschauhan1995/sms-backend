const classes_table = require("../constants/classes_table");
const { classAttendanceOfRange } = require("../methods/class_attendance_methods/classAttendanceOfRange");
const { getClassObjById } = require("../methods/classes_methods/getClassById");



const getClassAttendanceOfMonth = async (req, res) => {
  try{
    // console.log('school_id, created_year==>');
    const { user_id, school_id } = req?.user;
    const { session_year, class_id, month } = req?.params;
    if(!session_year) throw Error('Session year is required');
    if(!class_id) throw Error('Class id is required');
    if(!month) throw Error('Month is required');

    const classObj = await getClassObjById(class_id);
    if(!classObj) throw Error('Class id is not valid');
    if(classObj?.[classes_table?.SCHOOL_ID] !== school_id) throw Error('Class Id does not belong to your school');

    const start_date = session_year + '-' + month + '-01';
    const end_date = session_year + '-' + (month >= 12 ? '01' : parseInt(month) + 1) + '-01';

    const attendanceList = await classAttendanceOfRange(class_id, start_date, end_date);

    res.status(200).json(attendanceList);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getClassAttendanceOfMonth
}