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
const nav = require('./routes/nav');

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
app.use('/api/school', schoolRouter);
app.use('/api/users', usersRouter);
app.use('/api/teacher', teacherRouter);
app.use('/api/student', studentRouter);
app.use('/api/nav', nav);

db.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}).catch((err) => {
  console.log(`Connection error: ${err.message}`);
});