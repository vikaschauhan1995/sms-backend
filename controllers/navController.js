
const navListDetails = {
  root: [
    { name: 'User', url: '/user' },
    { name: 'School', url: '/school' }
  ],
  admin: [
    { name: 'Teacher', url: '/teacher' },
    // { name: 'Student', url: '/student' },
    { name: 'Teacher Attendance', url: '/teacher_attendance' },
    { name: 'Class Attendance', url: '/class_attendance' },
    { name: 'Class', url: '/class' },
    { name: 'Fee', url: '/student_fee'}
  ],
  teacher: [
    { name: 'Student Attendance', url: '/student_attendance' }
  ],
  student: [
    { name: 'My Attendance', url: '/my_attendance' },
  ],
};

const getNavListByUserType = (req, res) => {
  try {
    const { user_type } = req.params;
    if (!user_type) {
      throw Error("User type not specified");
    }
    res.status(200).json(navListDetails[user_type]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { getNavListByUserType };