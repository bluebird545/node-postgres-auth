const { User } = require('../models/index');

const getUsers = async(req, res) => {  
  try {
    const users = await User.findAll();
    
    res.status(200).send(users);
  } catch (error) {
    console.error(error)
  }
}

const getUser = (req, res) => {
  const { user } = req;

  return res.status(200).json({
    user
  })
}

module.exports = {
  getUsers,
  getUser
};