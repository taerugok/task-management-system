// server.js — Main entry point for the Task Manager API
const express = require('express');
const dotenv  = require('dotenv');
const cors    = require('cors');

dotenv.config(); // Load environment variables from .env

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());           // Allow cross-origin requests (React app on port 3000)
app.use(express.json());   // Parse JSON request bodies

// ── Routes ─────────────────────────────────────────────────────────────────

// Public routes — no token required
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);    // POST /api/auth/login, POST /api/auth/register

// Protected routes — JWT token required (enforced inside each route file)
const taskRoutes = require('./routes/taskRoutes');
app.use('/api', taskRoutes);          // GET/POST/PUT/DELETE /api/tasks

const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);          // GET /api/users

const bugRoutes = require('./routes/bugRoutes');
app.use('/api', bugRoutes);           // GET/POST/PUT/DELETE /api/bugs

// ── Root route ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('Task Manager API is running');
});

// ── Start server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
