const { ESRCH } = require('constants');
const express = require('express');
const morgan = require('morgan');
const app = express();
let user = require('./api/user');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/users', user);

app.listen(3000, () => {
  console.log('Server is running');
});

module.exports = app;