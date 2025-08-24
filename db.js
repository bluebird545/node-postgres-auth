const env = process.env.NODE_ENV || 'development';
const config = require('./config/db.config')[env];
const Sequelize = require('sequelize');

// module.exports = () => new Sequelize(
//   config.database,
//   config.username,
//   config.password,
//   config
// );

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

module.exports = sequelize;