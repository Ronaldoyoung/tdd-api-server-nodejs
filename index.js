const express = require('express');
const morgan = require('morgan');
const app = express();
let users = [
  { id: 1, name: 'alice' },
  { id: 2, name: 'bak' },
  { id: 3, name: 'chris' },
];

app.use(morgan('dev'));

app.get('/users', (req, res) => {
  res.json(users);
});

app.listen(3000, () => {
  console.log('Server is running');
});