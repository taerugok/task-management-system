// routes/authRoutes.js
const express        = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router         = express.Router();

// POST /api/auth/login           — authenticate user and return JWT
router.post('/login',    authController.login);

// POST /api/auth/register        — create new account and return JWT
router.post('/register', authController.register);

// PUT  /api/auth/change-password — change password (requires valid token)
router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
