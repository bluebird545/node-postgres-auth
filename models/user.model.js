// model defined by calling sequelize.define(modelName, attributes, options)
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    username: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    }
  });

  // define associations
  User.associate = function(models) {
    User.belongsToMany(models.Role, {
      through: 'user_roles',
        // constraints: false, // added to avoid foreign key constraint. look into this
    });
  };

  return User;
};