const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected routes (require authentication)
router.use(auth);
router.put('/preferences', authController.updatePreferences);
router.post('/onboarding', authController.updatePreferences);
router.get('/profile', authController.getProfile);
router.get('/verify', authController.verifyToken);

module.exports = router;