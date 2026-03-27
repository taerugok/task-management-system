// routes/taskRoutes.js
const express = require('express');
const taskController = require('../controllers/taskController'); // Task CRUD handlers
const authMiddleware = require('../middleware/authMiddleware');  // JWT protection
const router = express.Router();

// All task routes require a valid JWT token (authMiddleware runs first)

// GET    /api/tasks        — fetch all tasks (supports ?status= ?priority= ?page= etc.)
router.get('/tasks',     authMiddleware, taskController.getTasks);

// GET    /api/tasks/:id    — fetch a single task by ID
router.get('/tasks/:id', authMiddleware, taskController.getTaskById);

// POST   /api/tasks        — create a new task
router.post('/tasks',    authMiddleware, taskController.createTask);

// PUT    /api/tasks/:id    — update an existing task
router.put('/tasks/:id', authMiddleware, taskController.updateTask);

// DELETE /api/tasks/:id    — soft-delete a task (sets deleted_at, never removes row)
router.delete('/tasks/:id', authMiddleware, taskController.deleteTask);

module.exports = router;
