// controllers/bugController.js
// Handles HTTP requests for the Bug Tracker.
// Each function validates the input, calls the Bug model, and returns JSON.
// The logged-in user's ID comes from req.user (injected by authMiddleware).

const Bug = require('../models/bugModel');

// GET /api/bugs
// Returns all bug reports, including the username of the reporter and assignee.
// Uses a LEFT JOIN in the model so bugs without an assignee still appear.
exports.getBugs = async (req, res) => {
  try {
    const bugs = await Bug.getAllBugs();
    res.json({ bugs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/bugs
// Creates a new bug report.
// reported_by is taken from the JWT token (req.user.id), not the request body.
// This ensures users can only report bugs under their own name.
exports.createBug = async (req, res) => {
  const { title, description, status, priority, assigned_to } = req.body;

  // Title is the only required field
  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const bug = await Bug.createBug({
      title,
      description,
      status:      status    || 'Open',
      priority:    priority  || 'Medium',
      reported_by: req.user.id,   // always the logged-in user
      assigned_to: assigned_to || null,
    });
    res.status(201).json({ bug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/bugs/:id
// Updates an existing bug's fields.
// Returns 404 if the bug doesn't exist (no rows changed).
exports.updateBug = async (req, res) => {
  try {
    const result = await Bug.updateBug(req.params.id, req.body);
    if (result.changes === 0) return res.status(404).json({ error: 'Bug not found' });
    res.json({ message: 'Bug updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/bugs/:id
// Permanently removes a bug from the database.
// (Unlike tasks, bugs use hard delete — no soft-delete needed here.)
exports.deleteBug = async (req, res) => {
  try {
    const result = await Bug.deleteBug(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Bug not found' });
    res.json({ message: 'Bug deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
