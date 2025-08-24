const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { generateToken, decodeToken } = require('../utils/auth');

const PRIVATE_KEY = process.env.JWT_KEY

router.get('/ping', (req, res) => {
  console.log('here')
  res.json({ message: 'Api is ready!' })
});

router.get('/create-token', (req, res) => {
  console.log('creating cookie 1..2..3..')
  const user = {
    username: 'babyboop',
    id: 12
  }
  const testToken = generateToken(user)

  res.cookie('testToken', testToken, { httpOnly: true })

  res.status(200).json({ user, testToken });
})

router.post('/refresh-token', (req, res) => {
  console.log(`refresh token`)
  const user = {
    username: 'babyboop',
    id: 12
  }
  const testToken = generateToken(user)

  res.cookie('testToken', testToken, { httpOnly: true })

  res.status(200).json({ user, testToken });
})

router.get('/get-user-id', (req, res) => {
  console.log('getting cookie 1..2..3..')
  const token = req.cookies.testToken;

  if (!token) {
    console.log(`no token`)
  }
  
  try {
    console.log(`try decoding user from token`)
    const user = decodeToken(token)
    
    console.log(`got the user`)
    console.log(`user: ${user}`)
    
    res.status(200).json({ user });
  } catch (error) {
    // if (error instanceof TokenExpiredError) {
    //   console.log('Unauthorized. Token expired')
    //   res.status(401).send({ message: 'Unauthorized. Token expired' });
    // }
    res.status(401).send({ message: 'Unauthorized. Token expired' });
  }

  // console.log(req.cookies)
})

// test getting data and returning unauthorized
const validateToken = (req, res, next) => {
  console.log(`invalidToken middleware`)
  console.log(`throw unauthorized error`)

  const token = req.cookies.testToken;
  console.log(`testToken: ${token}`)

  if (!token) {
    console.log(`no testToken`)
    res.status(403).send({ message: 'No testToken provided' })
  }

  if (token === 'invalid') {
    console.log('bad token! bad! throw error!')
    res.status(401).send({ message: 'Unauthorized. Token expired' });
  } else {
    console.log(`valid token...next`)
    next();
  }
}
router.get('/get-user', validateToken, (req, res) => {
  console.log(`/api/test/get-user`)

  const user = {
    username: 'babyboop',
    id: 12
  }

  res.status(200).json({
    user,
    message: 'Successfully got user!'
  })
});
// test refresh, new token made, pass as cookie
router.get('/refresh-token', (req, res) => {
  console.log('/api/test/refresh-token')
  res.cookie('testToken', 'valid', { httpOnly: true });
  res.status(200).json({ testToken: 'valid' });
})
module.exports = router;