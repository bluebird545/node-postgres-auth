var jwt = require("jsonwebtoken");

const PRIVATE_KEY = process.env.JWT_KEY
const PRIVATE_KEY_EXP = process.env.JWT_KEY_EXP
const PRIVATE_REFRESH_KEY = process.env.JWT_REFRESH_KEY
const PRIVATE_REFRESH_KEY_EXP = process.env.JWT_REFRESH_KEY_EXP

exports.generateToken = (data) => {
  return jwt.sign(data, PRIVATE_KEY, { expiresIn: PRIVATE_KEY_EXP });
}

exports.generateRefreshToken = (data) => {
  return jwt.sign(data, PRIVATE_REFRESH_KEY, { expiresIn: PRIVATE_REFRESH_KEY_EXP });
}

exports.decodeToken = (token) => jwt.verify(token, PRIVATE_KEY)
exports.decodeRefreshToken = (token) => jwt.verify(token, PRIVATE_REFRESH_KEY)