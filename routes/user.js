const express = require('express');
const router = express.Router();
const { GetUser } = require('../controllers/userController');

// Get User route
router.get('/', GetUser);

module.exports = router;
