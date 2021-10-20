const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite',
  logging: false
});

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    unique: true
  }
});

module.exports = { Sequelize, sequelize, User };