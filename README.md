## Task Management System

<video width="100%" controls>
  <source src="demo.mp4" type="video/mp4">
</video>

A full-stack web application built for corporate IT teams to manage tasks, track bugs, monitor team performance, and collaborate efficiently.

## What is a Task Management System?

A Task Management System is a web platform that helps teams create, assign, track, and complete work items in one place. Instead of emails and spreadsheets, everything is in a single dashboard where every team member can see what needs to be done, who is doing it, and what is finished.

## Why Do You Need One?

In a corporate IT team, dozens of tasks run in parallel across multiple people. Without a system, tasks get lost, priorities get confused, and managers cannot see progress. A Task Management System solves this by giving every task a status, priority, assignee, and due date — so nothing falls through the cracks.

## The Idea of Assignment

Any task can be assigned to one or more people. This means two or three team members can be listed as working on the same task together. Each person's workload is visible on the Employees page and in Reports, so managers can balance work fairly.

## Project Structure
```
task-management-system/
├── demo.mp4                          ← Demo video
├── README.md                         ← Project overview & setup
├── API_DOCUMENTATION.md              ← All API endpoints
├── API_DOCS.md                       ← API quick reference
├── PROJECT_DOCUMENTATION.md          ← Full project explanation
├── .gitignore
│
├── backend/                          ← Node.js + Express + SQLite
│   ├── server.js                     ← Entry point (port 5000)
│   ├── seed.js                       ← Sample data loader
│   ├── package.json
│   ├── config/
│   │   └── db.js                     ← SQLite database connection
│   ├── controllers/
│   │   ├── authController.js         ← Login / register logic
│   │   ├── taskController.js         ← Task CRUD logic
│   │   └── bugController.js          ← Bug CRUD logic
│   ├── middleware/
│   │   └── authMiddleware.js         ← JWT verification
│   ├── models/
│   │   ├── userModel.js              ← User DB queries
│   │   ├── taskModel.js              ← Task DB queries
│   │   └── bugModel.js               ← Bug DB queries
│   ├── routes/
│   │   ├── authRoutes.js             ← /api/auth/*
│   │   ├── taskRoutes.js             ← /api/tasks/*
│   │   ├── bugRoutes.js              ← /api/bugs/*
│   │   └── userRoutes.js             ← /api/users/*
│   └── services/                     ← Business logic layer
│
└── frontend/                         ← React 18 (port 3000)
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js                    ← Routes & protected pages
        ├── index.js                  ← React entry point
        ├── services/
        │   └── api.js                ← All API calls (axios)
        └── Components/
            ├── LoginPage.js/css      ← Login screen
            ├── Layout.js/css         ← Sidebar + topbar shell
            ├── Dashboard.js/css      ← Overview & stats
            ├── TaskManager.js/css    ← Task list & filters
            ├── TaskForm.js/css       ← Create / edit task form
            ├── Employees.js/css      ← Team workload grid
            ├── Bugs.js/css           ← Bug tracker grid
            └── Reports.js/css        ← KPI & performance

```

## Pages

- Login — animated maroon bars with glassmorphism login card
- Dashboard — overview stats, team workload, priority breakdown, recent tasks
- Tasks — full task list with filters, sort, search, grid/list view, pagination
- Employees — per-person task cards with completion stats
- Bug Tracker — report and track bugs with priority and status
- Reports — KPI metrics, status distribution, team performance table


## Setup Instructions

You need Node.js 16 or higher.

## Backend

cd backend
npm install
node server.js

Runs on http://localhost:5000

## Frontend

cd task-management-system/frontend
npm install
npm start

Runs on http://localhost:3000

## Optional: Load sample data

cd backend
node seed.js

## Login Credentials

| Username | Password    |
|----------|-------------|
| admin    | password    |
| alice    | password    |
| bob      | password    |
| john     | password123 |
| sarah    | password123 |
| mike     | password123 |


## Tech Stack

- Frontend: React 18, React Router v6, plain CSS with glassmorphism
- Backend: Node.js, Express 4
- Database: SQLite via sqlite3
- Auth: JWT tokens (jsonwebtoken)



## Key Features

- JWT-based authentication with 24-hour tokens
- Multiple assignees per task (many-to-many relationship)
- Unique task IDs in TM-001 format
- Soft delete (tasks are never permanently removed)
- Server-side filtering and pagination
- Real-time notification system for new tasks (stored locally)
- Animated maroon bar background throughout
- Glassmorphism cards and sidebar
- Collapsible sidebar (230px to 64px)
- Admin info popup with session details
- Bug Tracker with Open / In Progress / Resolved workflow — 3-column grid view
- Employees page — 3-column grid view with per-person task stats
- Dashboard charts with SVG ring and progress bars
- Reports with team performance table
- Mobile-responsive layout
- Corporate sample data included (20 tasks, 11 bug reports)



## Non-Functional Requirements

- Readable, well-commented code throughout
- JWT-based security with protected routes
- SQLite indexes on all frequently queried columns
- Soft delete keeps data integrity intact
- Error handling on all API endpoints with meaningful messages
- Environment variable support via dotenv




