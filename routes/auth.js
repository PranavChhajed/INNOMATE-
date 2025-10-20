const express = require('express');
const router = express.Router();
const { login, signup, verifyToken } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Auth routes
router.post('/login', login);
router.post('/signup', signup);
router.get('/verify', protect, verifyToken);

module.exports = router; 