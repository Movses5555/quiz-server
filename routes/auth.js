const express = require('express');
const router = express.Router();

const { Register, Login, Logout } = require('../controllers/authController');

// Registration route
router.post('/register', Register);

// Login route
router.post('/login', Login);

// Logout route
router.get('/logout', Logout);

module.exports = router;

