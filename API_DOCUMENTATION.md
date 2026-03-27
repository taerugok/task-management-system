# API Documentation — Task Management System

Base URL: `http://localhost:5000/api`

All protected routes require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication

### POST /api/auth/login
Login with username and password.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

**Response 401:**
```json
{ "error": "Invalid username or password" }
```

---

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "newuser",
  "password": "mypassword"
}
```

**Response 201:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 7,
    "username": "newuser"
  }
}
```

**Validation errors:**
- Username must be at least 3 characters
- Password must be at least 6 characters
- Username already taken → 409

---

### PUT /api/auth/change-password
Change the logged-in user's password. **Requires auth token.**

**Request Body:**
```json
{
  "currentPassword": "password",
  "newPassword": "newsecurepassword"
}
```

**Response 200:**
```json
{ "message": "Password changed successfully" }
```

---

## Tasks

### GET /api/tasks
Fetch all tasks. Supports server-side filtering and pagination. **Requires auth.**

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status: `Pending`, `In Progress`, `Completed` |
| `priority` | string | Filter by priority: `High`, `Medium`, `Low` |
| `assigned_user_id` | number | Filter tasks assigned to a specific user ID |
| `search` | string | Search in title and description |
| `sortBy` | string | `newest` (default), `oldest`, `priority`, `due` |
| `page` | number | Page number (default: 1) |
| `limit` | number | Tasks per page (default: all) |

**Example:** `GET /api/tasks?status=Pending&priority=High&page=1&limit=10`

**Response 200:**
```json
{
  "tasks": [
    {
      "id": 3,
      "title": "Fix login page crash",
      "description": "Users report a white screen on mobile Chrome.",
      "status": "In Progress",
      "priority": "High",
      "due_date": "2026-03-25",
      "assigned_user_id": 1,
      "deleted_at": null,
      "assignees": [
        { "id": 1, "username": "admin" },
        { "id": 2, "username": "alice" }
      ]
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

### GET /api/tasks/:id
Fetch a single task by ID. **Requires auth.**

**Response 200:**
```json
{
  "task": {
    "id": 3,
    "title": "Fix login page crash",
    "status": "In Progress",
    "priority": "High",
    "due_date": "2026-03-25",
    "assignees": [
      { "id": 1, "username": "admin" }
    ]
  }
}
```

---

### POST /api/tasks
Create a new task. **Requires auth.**

**Request Body:**
```json
{
  "title": "Implement search feature",
  "description": "Add a full-text search bar to the tasks page.",
  "status": "Pending",
  "priority": "Medium",
  "due_date": "2026-04-15",
  "assignee_ids": [1, 2, 3]
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `title` | Yes | |
| `description` | No | |
| `status` | No | Defaults to `Pending` |
| `priority` | No | Defaults to `Medium` |
| `due_date` | No | ISO date string `YYYY-MM-DD` |
| `assignee_ids` | Yes | Array of user IDs |

**Response 201:**
```json
{
  "task": {
    "id": 16,
    "title": "Implement search feature",
    "priority": "Medium",
    "assignees": []
  }
}
```

---

### PUT /api/tasks/:id
Update an existing task. **Requires auth.**

**Request Body:** Same fields as POST.

**Response 200:**
```json
{ "message": "Task updated successfully" }
```

**Response 404:**
```json
{ "error": "Task not found" }
```

---

### DELETE /api/tasks/:id
Soft-delete a task (sets `deleted_at` timestamp, never removes from DB). **Requires auth.**

**Response 200:**
```json
{ "message": "Task deleted" }
```

---

## Bugs

### GET /api/bugs
Fetch all bugs. **Requires auth.**

**Response 200:**
```json
{
  "bugs": [
    {
      "id": 1,
      "title": "Login button unresponsive on Safari",
      "description": "Clicking login does nothing on Safari 17.",
      "status": "Open",
      "priority": "High",
      "reported_by": 1,
      "assigned_to": 2,
      "created_at": "2026-03-27 10:30:00",
      "reporter_name": "admin",
      "assignee_name": "alice"
    }
  ]
}
```

---

### POST /api/bugs
Report a new bug. **Requires auth.**

**Request Body:**
```json
{
  "title": "Login button unresponsive on Safari",
  "description": "Clicking login does nothing on Safari 17.",
  "status": "Open",
  "priority": "High",
  "assigned_to": 2
}
```

**Response 201:**
```json
{
  "bug": {
    "id": 1,
    "title": "Login button unresponsive on Safari",
    "status": "Open",
    "priority": "High"
  }
}
```

---

### PUT /api/bugs/:id
Update a bug. **Requires auth.**

**Request Body:**
```json
{
  "title": "Login button unresponsive on Safari",
  "description": "Fixed in v1.2",
  "status": "Resolved",
  "priority": "High",
  "assigned_to": 2
}
```

**Response 200:**
```json
{ "message": "Bug updated" }
```

---

### DELETE /api/bugs/:id
Delete a bug report permanently. **Requires auth.**

**Response 200:**
```json
{ "message": "Bug deleted" }
```

---

## Users

### GET /api/users
Fetch all users (for populating assignment dropdowns). **Requires auth.**

**Response 200:**
```json
{
  "users": [
    { "id": 1, "username": "admin" },
    { "id": 2, "username": "alice" },
    { "id": 3, "username": "bob" }
  ]
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{ "error": "Descriptive error message here" }
```

| HTTP Status | Meaning |
|-------------|---------|
| 400 | Bad request — missing or invalid fields |
| 401 | Unauthorized — missing or invalid JWT token |
| 404 | Not found — resource doesn't exist |
| 409 | Conflict — e.g. username already taken |
| 500 | Internal server error |

---

## Database Schema

```sql
-- Users
CREATE TABLE users (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Tasks
CREATE TABLE tasks (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  title            TEXT NOT NULL,
  description      TEXT,
  status           TEXT DEFAULT 'Pending',
  assigned_user_id INTEGER,
  priority         TEXT DEFAULT 'Medium',
  due_date         TEXT,
  deleted_at       TEXT,
  FOREIGN KEY (assigned_user_id) REFERENCES users(id)
);

-- Many-to-many task assignments
CREATE TABLE task_assignees (
  task_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  PRIMARY KEY (task_id, user_id),
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Bug reports
CREATE TABLE bugs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT DEFAULT 'Open',
  priority    TEXT DEFAULT 'Medium',
  reported_by INTEGER,
  assigned_to INTEGER,
  created_at  TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (reported_by) REFERENCES users(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);
```
