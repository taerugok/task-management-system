// routes/userRoutes.js
const express = require('express');
const User = require('../models/userModel');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// GET /api/users — return all users (id + username only, no passwords)
// Protected: requires a valid JWT token
// Used by the frontend to populate the "Assign to" dropdown in the task form
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
