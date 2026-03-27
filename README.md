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
  <img width="1918" height="940" alt="image" src="https://github.com/user-attachments/assets/1e2e3af1-bf08-414f-90b5-f651a92332c8" />
This is the first screen. It has a black background with animated vertical bars that slowly rise and fall in a maroon colour. On top of this is a glass-effect login card with blurred background (glassmorphism). The title "Task Management System" has a deep red glow that brightens when you hover over it. You enter a username and password, click Login, and you are taken to the Dashboard. The page files are `LoginPage.js` and `LoginPage.css`.

- Dashboard — overview stats, team workload, priority breakdown, recent tasks
  <img width="1918" height="938" alt="image" src="https://github.com/user-attachments/assets/2da04e0e-0adf-46a3-9abb-ecb034041b39" />
The Dashboard gives a bird's-eye view of the entire team's work. At the top are four stat cards showing the total number of tasks, how many are Pending, In Progress, and Completed. Each card glows red and lifts slightly when you hover over it. Below is a two-column grid — the left side shows team member cards with progress bars and badge counts, and the right side shows a priority breakdown with coloured bars and an SVG ring chart showing the overall completion percentage. At the bottom is a list of the six most recent tasks. The page files are `Dashboard.js` and `Dashboard.css`.

- Tasks — full task list with filters, sort, search, grid/list view, pagination
  <img width="1917" height="939" alt="image" src="https://github.com/user-attachments/assets/653ba785-ce0a-4031-b487-ecf500400c49" />
This is the main working page. It shows all tasks as cards in either a list or grid layout. At the top there are four clickable stat cards — clicking Pending, for example, instantly filters the list to show only pending tasks. Below is a control bar with a search box, four dropdowns (filter by status, user, priority, and sort order), and view-toggle buttons for list, grid, and group-by-status modes.

Each task card shows the task ID in TM-001 format, a priority badge, a due-date label (with colour coding for overdue, today, soon), and a status badge. At the bottom of each card are the assigned users as avatar circles and Edit and Delete buttons.

Clicking a card opens a detail modal with the full description, progress bar, assignee list, and due date. Clicking Edit opens the task form where you can change everything including the assignees (using a scrollable checkbox list). The page files are `TaskManager.js` and `TaskManager.css`.

- Employees — per-person task cards with completion stats
  <img width="1918" height="939" alt="image" src="https://github.com/user-attachments/assets/1dd5230f-0ef3-41fe-a96a-93747d8013bf" />
This page shows every user as a card in a grid. Each card displays the person's name initial as a coloured avatar, and four stat numbers: total tasks assigned, active tasks, completed tasks, and high- priority tasks. Hovering over a card lifts it and adds a red border glow. Clicking a card expands it to show up to five of the person's tasks. The page files are `Employees.js` and `Employees.css`.
  
- Bug Tracker — report and track bugs with priority and status
  <img width="1919" height="942" alt="image" src="https://github.com/user-attachments/assets/7acbc08a-757b-4c89-8e71-7ec83350d8bf" />
  
This is where team members log technical problems. There are four stat cards at the top (Total, Open, In Progress, Resolved). Below is a search bar and two filter dropdowns. Each bug appears as a card showing a BUG-001 ID, priority badge, status badge, title, and description. The card shows who reported the bug and who it is assigned to.

The "Report Bug" button opens a form modal where you fill in the title, description, status, priority, and who to assign it to. The assign dropdown shows all users in the system. If the form fails to submit, an inline red error message appears directly inside the form so it is impossible to miss. The page files are `Bugs.js` and `Bugs.css`.

- Reports — KPI metrics, status distribution, team performance table
  <img width="1919" height="940" alt="image" src="https://github.com/user-attachments/assets/072c605d-8580-49f9-a2af-1a72ed8d1bad" />

This page is for managers. The top row has four KPI cards: Total Tasks, Completion Rate, Overdue Tasks, and Team Members. Below is a two-column grid — the left card shows a horizontal bar chart of task distribution by status, and the right card shows three circular SVG charts for High, Medium, and Low priority tasks. At the bottom is a full-width team performance table listing every team member with their total tasks, completed tasks, high-priority tasks, and a completion progress bar. The page files are `Reports.js` and `Reports.css`.

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




