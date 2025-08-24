const { User } = require('../models/index');

module.exports.findUser = (id) => {
  return User.findOne({ where: id });
}