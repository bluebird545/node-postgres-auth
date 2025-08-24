const ApiError = require('../utils/errors');
const { User, Role } = require('../models/index');
const { verifyToken, decodeToken } = require('../utils/auth');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const { TokenExpiredError } = jwt;

exports.verifyUser = (req, res, next) => {  
  // get access token
  const authHeader = req.headers['authorization']
  const accessToken = authHeader && authHeader.split(' ')[1] || req.cookies.accessToken

  // handle missing access token
  if (!accessToken || typeof accessToken == undefined) {
    res.status(403).send({ message: 'No access token provided' })
  }

  try {
    // validate access token
    const decoded = decodeToken(accessToken);
    
    req.user = decoded; // add user to request
    next(); // continue
  } catch (error) {
    // access token invalid
    if (error instanceof TokenExpiredError) {
      return res.status(401).send({ message: 'Unauthorized. Token expired' });
    }

    return res.status(401).send({ message: 'Unauthorized.' });
  }
}

exports.checkIfUserExists = (req, res, next) => {
  const { username, email } = req.body;

  User
    .findOne({
      where: {
        [Op.or]: [{username}, {email}]
      }
    })
    .then((user) => {
      if (user) {
        return res
          .status(400)
          .send({ message: 'Username or email already exists' });
      }
      next();
    });
};

exports.checkIfRoleExists = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!['user', 'admin', 'moderator'].includes(req.body.roles[i])) {
        return res.status(400).send({ message: 'Role does not exist' });
      }
    }
  }

  next();
}