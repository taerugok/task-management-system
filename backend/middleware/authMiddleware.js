// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

// This middleware runs before protected route handlers.
// It reads the JWT from the Authorization header, verifies it,
// and attaches the decoded user info to req.user for use downstream.
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Expect header format: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Extract just the token part

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Throws if invalid or expired
    req.user = decoded; // Make user info available to the next handler
    next();             // Continue to the actual route handler
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
  }
};

module.exports = authMiddleware;
