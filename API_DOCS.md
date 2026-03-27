# API Documentation — Task Management System

Base URL: http://localhost:5000/api

All protected routes require the Authorization header:
Authorization: Bearer YOUR_JWT_TOKEN

---

## Authentication

### POST /api/auth/login

Logs in a user and returns a JWT token.

Request body:
  username: string (required)
  password: string (required)

Success response (200):
  token: JWT string
  user: { id, username }

Error responses:
  400 — username or password missing
  401 — invalid credentials

---

### POST /api/auth/register

Creates a new user account.

Request body:
  username: string (min 3 characters)
  password: string (min 6 characters)

Success response (201):
  token: JWT string
  user: { id, username }

Error responses:
  400 — validation failed
  409 — username already taken

---

### PUT /api/auth/change-password

Changes the logged-in user's password. Requires token.

Request body:
  currentPassword: string
  newPassword: string (min 6 characters)

Success response (200):
  message: "Password changed successfully"

Error responses:
  400 — missing fields or password too short
  401 — current password incorrect
  404 — user not found

---

## Tasks

### GET /api/tasks

Returns all tasks. Supports optional query parameters for filtering.

Query parameters (all optional):
  status — Pending, In Progress, or Completed
  priority — High, Medium, or Low
  assigned_user_id — user ID number
  search — text search in title and description
  sortBy — newest, oldest, priority, or due
  page — page number (default 1)
  limit — results per page (default 50)

Success response (200):
  tasks: array of task objects
  total: total count
  page: current page
  limit: page size
  totalPages: total pages

Each task object includes:
  id, title, description, status, priority, due_date,
  assigned_user_id, assignees (array of { id, username }),
  created_at, deleted_at

---

### GET /api/tasks/:id

Returns a single task by ID.

Success response (200):
  task: task object

Error response:
  404 — task not found

---

### POST /api/tasks

Creates a new task.

Request body:
  title: string (required)
  description: string
  status: Pending, In Progress, or Completed (default: Pending)
  priority: High, Medium, or Low (default: Medium)
  due_date: YYYY-MM-DD string
  assignee_ids: array of user ID numbers

Success response (201):
  task: created task object

---

### PUT /api/tasks/:id

Updates an existing task.

Request body: same fields as POST /api/tasks

Success response (200):
  message: "Task updated"

Error response:
  404 — task not found or already deleted

---

### DELETE /api/tasks/:id

Soft-deletes a task (sets deleted_at timestamp, does not remove the row).

Success response (200):
  message: "Task deleted"

Error response:
  404 — task not found

---

## Users

### GET /api/users

Returns all users (for populating assignee dropdowns).

Success response (200):
  users: array of { id, username }

---

## Bugs

### GET /api/bugs

Returns all bug reports, including reporter and assignee names.

Success response (200):
  bugs: array of bug objects

Each bug object includes:
  id, title, description, status, priority,
  reported_by, assigned_to, created_at,
  reporter_name, assignee_name

---

### POST /api/bugs

Creates a new bug report. Reported_by is set automatically from the logged-in user's token.

Request body:
  title: string (required)
  description: string
  status: Open, In Progress, or Resolved (default: Open)
  priority: High, Medium, or Low (default: Medium)
  assigned_to: user ID number (optional)

Success response (201):
  bug: created bug object

---

### PUT /api/bugs/:id

Updates an existing bug report.

Request body: same fields as POST /api/bugs (except reported_by)

Success response (200):
  message: "Bug updated"

---

### DELETE /api/bugs/:id

Permanently deletes a bug report.

Success response (200):
  message: "Bug deleted"

Error response:
  404 — bug not found

---

## Error Format

All error responses follow this format:
  error: "human-readable error message"

---

## Status Codes Used

200 — success
201 — created
400 — bad request (validation error)
401 — unauthorized (wrong credentials or missing/invalid token)
404 — not found
409 — conflict (e.g. username taken)
500 — server error
