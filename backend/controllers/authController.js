// controllers/authController.js
const jwt = require('jsonwebtoken');       // For creating JWT tokens
const User = require('../models/userModel'); // User model for DB operations
const db   = require('../config/db');       // Direct DB access for password update

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

// ── Login ──────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Checks credentials and returns a JWT token if valid
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Validate that both fields are present
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Look up user by username
    const user = await User.findByUsername(username);

    // Compare password (plain text comparison for mock auth)
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Sign a JWT token valid for 24 hours
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return token and basic user info (no password)
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Register ───────────────────────────────────────────────────────────────
// POST /api/auth/register
// Creates a new user account and returns a JWT token
exports.register = async (req, res) => {
  const { username, password } = req.body;

  // Validate required fields
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Basic password length check
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Username length check
  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }

  try {
    // Make sure the username is not already taken
    const existing = await User.findByUsername(username);
    if (existing) {
      return res.status(409).json({ error: 'Username already taken. Please choose another.' });
    }

    // Create the user
    const newUser = await User.createUser(username, password);

    // Issue a JWT token immediately so they are logged in after registering
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, user: { id: newUser.id, username: newUser.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Change Password ─────────────────────────────────────────────────────────
// PUT /api/auth/change-password  (requires valid JWT via authMiddleware)
// Body: { currentPassword, newPassword }
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // injected by authMiddleware after token verification

  // Validate input
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'currentPassword and newPassword are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  try {
    // Load user and verify their current password
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.password !== currentPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password in the database (plain-text for now — matches existing auth design)
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET password = ? WHERE id = ?',
        [newPassword, userId],
        function (err) { if (err) reject(err); else resolve(); }
      );
    });

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
