if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '../SECRET/.dev.env' });
}
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./db');

const PORT = process.env.BACKEND_PORT;

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello docker worldd');
});

app.get('/addUser', async (req, res) => {
  try {
    const { data } = req.body;
    const query = "INSERT INTO user (name, email, password) VALUES ('vikas', 'vikas@gmail.com', 'vikas1')";
    const values = [data];
    await db.query(query, values);
    res.status(201).json({ message: 'Data added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/check-connection', async (req, res) => {
  try {
    const query = 'SELECT NOW() AS current_time';
    const result = await db.query(query);
    const currentTime = result.rows[0].current_time;

    res.status(200).json({ message: 'Database connected successfully', currentTime });
    // pg.end()
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
db.connect().then(() => {
  db.query('SELECT NOW()', (err, res) => {
    console.log(res.rows)
    // pg.end()
  });
});