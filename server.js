if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '../SECRET/.dev.env' });
}
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./db');

const authRouter = require('./routes/auth');
const schoolRouter = require('./routes/school');
const tokenValidation = require('./middleware/tokenValidation');

const PORT = process.env.BACKEND_PORT;

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  // tokenValidation(req, res, next);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello docker worldd');
});

app.use('/auth', authRouter);
app.use('/school', schoolRouter);

db.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}).catch((err) => {
  console.log(`Connection error: ${err.message}`);
});