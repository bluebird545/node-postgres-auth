const express = require('express');

const authController = require('../controllers/auth.controller');
const { checkIfUserExists, checkIfRoleExists } = require('../middleware/auth');

const router = express.Router();

/**
 * Register a new user
 * Check if user already exists in database
 * Check if user's role exists
 */
router.post('/register', [checkIfUserExists, checkIfRoleExists], authController.register);

/**
 * Sign in a user
 */
router.post('/signin', authController.signin);

/**
 * Log out user
 */
router.post('/logout', authController.logout);

/**
 * Refresh token
 */
router.post('/refresh', authController.refreshToken)

module.exports = router;