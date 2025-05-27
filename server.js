if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '../SECRET/.dev.env' });
}
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const db = require('./db');

const authRouter = require('./routes/auth');
const schoolRouter = require('./routes/school');
const usersRouter = require('./routes/users');
const teacherRouter = require('./routes/teacher');
const studentRouter = require('./routes/student');
const navRouter = require('./routes/nav');
const teacherAttendanceRouter = require('./routes/teacher_attendance')
const classesRouter = require('./routes/classes')
const adminRouter = require('./routes/admin')
const sessionYearRouter = require('./routes/session_year');
const studentAttendanceRouter = require('./routes/student_attendance');
const homeworkRouter = require('./routes/homework');

const tokenValidation = require('./middleware/tokenValidation');

const PORT = process.env.BACKEND_PORT;

app.use(bodyParser.json());
app.use(cors({
  origin: [`${process.env.FRONT_END_URL}`, `${process.env.USER_FRONT_END_URL}`]
}));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  // tokenValidation(req, res, next);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello docker worldd');
});

app.use('/api/auth', authRouter);
app.use('/api/school', tokenValidation, schoolRouter);
app.use('/api/users', tokenValidation, usersRouter);
app.use('/api/teacher', tokenValidation, teacherRouter);
app.use('/api/student', tokenValidation, studentRouter);
app.use('/api/nav', tokenValidation, navRouter);
app.use('/api/teacher_attendance', tokenValidation, teacherAttendanceRouter);
app.use('/api/classes', tokenValidation, classesRouter);
app.use('/api/admin', tokenValidation, adminRouter);
app.use('/api/session_year', tokenValidation, sessionYearRouter);
app.use('/api/student_attendance', tokenValidation, studentAttendanceRouter);
app.use('/api/homework', tokenValidation, homeworkRouter);

db.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}).catch((err) => {
  console.log(`Connection error: ${err.message}`);
});