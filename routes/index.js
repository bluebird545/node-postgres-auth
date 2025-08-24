const express = require('express');

const router = express.Router();

router.use('/test', require('./test.routes'));
router.use('/users', require('./user.routes'));
router.use('/auth', require('./auth.routes'));

module.exports = router;