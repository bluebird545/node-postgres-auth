'use strict';
// model defined by extending Model and calling init(attributes, options)
const { Model } = require('sequelize');
const { generateRefreshToken } = require('../utils/auth');

module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // define associations
    static associate(models) {
      // define association here
      RefreshToken.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user_id'
      });
    }
  }
  
  RefreshToken.init(
    {
      // define model attributes
      userId: DataTypes.INTEGER,
      token: DataTypes.STRING,
      expiration: DataTypes.DATE
    },
    {
      // other model options
      sequelize,
      modelName: 'refresh_token',
      // underscored: true
    }
  );

  RefreshToken.createToken = async function(user) {
    let _token = generateRefreshToken({
      id: user.id,
      username: user.username,
      email: user.email,
      // roles
    });

    const currentDate = new Date()
    const numOfMins = ((process.env.JWT_REFRESH_KEY_EXP / 1000) / 60) * 60000

    // insert refresh token into database
    let newRefreshToken = await RefreshToken.create({
      token: _token,
      userId: user.id,
      expiration: new Date(currentDate.getTime() + numOfMins)
    });

    return newRefreshToken.token;
  };

  RefreshToken.verifyExpiration = (token) => {
    return token.expiration.getTime() < new Date().getTime();
  };

  return RefreshToken;
};