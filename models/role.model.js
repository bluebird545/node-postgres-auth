// model defined by calling sequelize.define(modelName, attributes, options)
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'roles',
    {
      // define model attributes
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: 'user' | 'admin' | 'moderator'
      }
    },
    {
      // other model options
    },
  );

  // define associations
  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      through: 'user_roles',
        // constraints: false, // added to avoid foreign key constraint. look into this
    });
  };

  return Role;
};