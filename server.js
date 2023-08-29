const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello docker worldd');
});

app.listen(process.env.BACKEND_PORT, () => {
  console.log(`App listening on port ${process.env.BACKEND_PORT}`);
});