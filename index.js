const { ESRCH } = require('constants');
const express = require('express');
const morgan = require('morgan');
const app = express();
let users = [
  { id: 1, name: 'alice' },
  { id: 2, name: 'bak' },
  { id: 3, name: 'chris' },
];

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.get('/users', (req, res) => {
  req.query.limit = req.query.limit || 10;
  const limit = parseInt(req.query.limit, 10);
  if (Number.isNaN(limit)) {
    return res.status(400).end();
  }
  res.json(users.slice(0, limit));
});

app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).end();
  }
  const user = users.filter(user => user.id === id)[0];
  if (!user) {
    return res.status(404).end();
  }
  res.json(user);
});

app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).end();
  }
  users = users.filter(user => user.id !== id);
  res.status(204).end();
});

app.post('/users', (req, res) => {
  const name = req.body.name;
  if (!name) return res.status(400).end();

  const isConflict = users.filter(user => user.name === name).length;
  if (isConflict) return res.status(409).end();
  const id = Date.now();
  const user = { id, name };
  users.push(user);
  res.status(201).json(user);
})

app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const name = req.body.name;

  const user = users.filter(user => user.id === id)[0];
  user.name = name;

  res.json(user);
})

app.listen(3000, () => {
  console.log('Server is running');
});

module.exports = app;