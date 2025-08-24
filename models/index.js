const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const models = {
  User: require('./user.model')(sequelize, DataTypes),
  Role: require('./role.model')(sequelize, DataTypes),
  RefreshToken: require('./refresh_token.model')(sequelize, DataTypes)
};

// loop over each model to call any associations
Object.keys(models).forEach((modelName) => {
  console.log(modelName)
  // if (models[key] && models[key].associate) {
  //   models[key].associate(models);
  // }
  if ('associate' in models[modelName]) {
    console.log(`${modelName} has an association`)
    models[modelName].associate(models);
  }
});

module.exports = {
  ...models
  // User,
  // Role,
  // RefreshToken
};