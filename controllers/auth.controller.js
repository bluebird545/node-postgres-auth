const { Op } = require('sequelize');
const { User, Role, RefreshToken } = require('../models/index');
const { generateToken, generateRefreshToken, decodeToken, decodeRefreshToken } = require('../utils/auth');
var bcrypt = require("bcryptjs");

exports.register = async(req, res) => {
  if (!req.body || req.body == {} || Object.keys(req.body).length === 0) return res.status(400).json({ message: 'No data' });
  
  const { username, email, password, roles } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
    });
  
    if (roles) {
      const userRoles = await Role.findAll({
        where: {
          name: {
            [Op.or]: roles
          }
        }
      });
  
      await user.setRoles(userRoles);
    } else {
      await user.setRoles([1]); // set role as user
    }
  
    return res.status(200).send({
      message: 'User was successfully registered!'
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

exports.signin = async(req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email },
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  });

  if (!user) return res.status(404).send({ message: 'User not found' });

  // verify password
  const validPassword = bcrypt.compareSync(
    password,
    user.password
  );

  if (!user || !validPassword) {
    return res.status(403).json({ error: 'Error', message: 'Invalid credentials '});
  }

  // create access token
  const accessToken = generateToken({
    id: user.id,
    username: user.username,
    email: user.email,
    // roles
  });

  // create refresh token
  // save refresh token in database
  let refreshToken = await RefreshToken.createToken(user)

  const options = {
    // maxAge: 120000, // expire after 2 minutes
    httpOnly: true, // Cookie will not be exposed to client side code
    // sameSite: "true", // If client and server origins are different
    secure: false // use with HTTPS only
  }

  // set tokens in http-only cookie
  res.cookie('accessToken', accessToken, options)
  res.cookie('refreshToken', refreshToken, options)

  return res.status(200).json({ 
    user: { 
      id: user.id,
      username: user.username,
      email: user.email,
    }, 
    accessToken 
  });
}

exports.logout = async(req, res) => {
  const authHeader = req.headers['authorization'];

  // const accessToken = (authHeader && authHeader.split(' ')[1]) || req.cookies.accessToken,
  // refreshToken = req.cookies.refreshToken;

  // clear cookies
  res.clearCookie('accessToken', {
    httpOnly: true,
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
  });

  // delete refresh token from database
  await RefreshToken.destroy({ where: { token: refreshToken } });

  return res.status(200).json({ message: 'Successfully logged out!' })
}

exports.refreshToken = async(req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) return res.status().json({ message: 'Refresh token not found' });
  
  let currentRefreshToken = await RefreshToken.findOne({
    where: {
      // userId: decode?.id,
      token: incomingRefreshToken
    }
  });

  if (!currentRefreshToken) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  if (RefreshToken.verifyExpiration(currentRefreshToken)) {
    RefreshToken.destroy({ where: { id: currentRefreshToken.id }});
    return res.status(403).json({ message: 'Refresh token expired. Make a sign in request' });
  }

  const user = await User.findOne({
    where: {
      id: currentRefreshToken.userId
    },
    attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
  });

  // create new access token
  let newAccessToken = generateToken({user});

  // create refresh token
  // save refresh token in database
  let newRefreshToken = await RefreshToken.createToken(user)

  res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: false })
  res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: false })

  return res
    .status(200)
    .json({
      accessToken: newAccessToken,
      message: 'Access token refreshed'
    });
}