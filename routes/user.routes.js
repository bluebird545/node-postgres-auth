const express = require('express');

const userController = require('../controllers/user.controller');
const { verifyUser } = require('../middleware/auth');

const router = express.Router();

/**
 * Get users
 */
router.route('/').get(userController.getUsers);

/**
 * Get a logged in user
 */
router.get('/:id(\\d+|me)', verifyUser, userController.getUser);

module.exports = router;