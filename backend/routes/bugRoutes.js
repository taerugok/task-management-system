// routes/bugRoutes.js
// Defines all REST endpoints for the Bug Tracker feature.
// Every route is protected by authMiddleware — a valid JWT token is required.
// Mounted at /api in server.js, so full paths are:
//   GET    /api/bugs        → list all bugs with reporter and assignee names
//   POST   /api/bugs        → report a new bug (reported_by set from token)
//   PUT    /api/bugs/:id    → update a bug's title, status, priority, or assignee
//   DELETE /api/bugs/:id    → permanently remove a bug report

const express       = require('express');
const bugController = require('../controllers/bugController');
const authMiddleware = require('../middleware/authMiddleware');
const router        = express.Router();

// GET  /api/bugs — fetch all bugs (JOIN users table to get names)
router.get('/bugs', authMiddleware, bugController.getBugs);

// POST /api/bugs — create a new bug report
router.post('/bugs', authMiddleware, bugController.createBug);

// PUT  /api/bugs/:id — edit an existing bug report
router.put('/bugs/:id', authMiddleware, bugController.updateBug);

// DELETE /api/bugs/:id — permanently delete a bug report
router.delete('/bugs/:id', authMiddleware, bugController.deleteBug);

module.exports = router;
