# Task Management System — Project Documentation


## What is a Task Management System?

A Task Management System is a web-based platform where a team creates, assigns, and tracks pieces of work called tasks. Every task has a title, description, priority level, due date, and one or more people responsible for it. The system shows the current status of every task — whether it is Pending, In Progress, or Completed — in a clean visual interface so anyone on the team knows exactly what is happening at any point in time.

This application also includes a Bug Tracker, which is a separate space where team members can log technical problems they are facing. Other members can see these bugs and step in to help, so no one gets stuck without support.


---


## Why Do You Need a Task Management System?

In a corporate IT team, work comes from multiple directions at once. Different people are handling different priorities and deadlines. Without a central system, critical tasks get forgotten, two people may unknowingly work on the same thing, or a manager has no way to see who is overloaded.

A Task Management System solves all of this. Every piece of work is tracked in one place. Managers can instantly see the overall picture — how many tasks are pending, who has too many assignments, and what is overdue. Team members know exactly what they are responsible for and when it is due.


---


## The Idea of Assignment

In this system, each task can be assigned to between one and three people (or more). This is useful when a task genuinely requires teamwork — for example, a database migration might need a backend developer and a DBA together.

Multiple assignees are stored in a separate join table in the database. When a task is shown on screen, all the assigned people appear as small avatar circles stacked side by side. The Employees page and Reports page both use this assignment data to calculate each person's workload and performance.


---


## Structure of the System

The project is divided into two parts that run separately:

The frontend is a React application. It runs on port 3000. All the pages, navigation, forms, and visual components live here. The code is in `task-management-system/frontend/src/Components/`. Each page has its own JavaScript file and its own CSS file. API calls to the backend are all centralised in `services/api.js`.

The backend is a Node.js and Express application. It runs on port 5000. It receives requests from the frontend, talks to the SQLite database, and sends back data as JSON. The code is split into routes (which define the URL paths), controllers (which handle the logic), and models (which query the database). The database file is `backend/database.db`.

The database uses SQLite. It stores four main tables: users, tasks, task_assignees (the join table for multiple assignees), and bugs.


---


## Development Process

The system was built incrementally:

The backend was set up first with Express, the SQLite database, and JWT authentication. The login and register endpoints were added so users could securely access the app.

Then the task CRUD (create, read, update, delete) was added. Tasks started with a single assigned user. Soft delete was implemented — when a task is deleted, it is not removed from the database but instead marked with a `deleted_at` timestamp. This preserves history.

The frontend login page was built next with the animated maroon background bars and glassmorphism card. After login, users landed on the original task list.

The design was then expanded into a full sidebar layout with five pages: Dashboard, Tasks, Employees, Bug Tracker, and Reports. A collapsible left sidebar was added with navigation, an admin info popup, and a notification bell in the top bar.

Multiple assignees were added as a feature — the database schema was extended with a `task_assignees` join table and the task forms were updated to show a checkbox list instead of a single dropdown.

Priority filtering was fixed by normalising NULL priority values in the database and adding a `COALESCE` check in SQL queries.

The Bug Tracker page was built with its own backend endpoints, its own database table, and its own frontend component.

Finally, the notification system was added — when a new task is created, an entry is saved to localStorage and the bell icon shows an unread count badge.


---


## Each Page — What It Does and How It Works

### Login Page
<img width="1918" height="940" alt="image" src="https://github.com/user-attachments/assets/1e2e3af1-bf08-414f-90b5-f651a92332c8" />
This is the first screen. It has a black background with animated vertical bars that slowly rise and fall in a maroon colour. On top of this is a glass-effect login card with blurred background (glassmorphism). The title "Task Management System" has a deep red glow that brightens when you hover over it. You enter a username and password, click Login, and you are taken to the Dashboard. The page files are `LoginPage.js` and `LoginPage.css`.

### Dashboard
<img width="1918" height="938" alt="image" src="https://github.com/user-attachments/assets/2da04e0e-0adf-46a3-9abb-ecb034041b39" />

The Dashboard gives a bird's-eye view of the entire team's work. At the top are four stat cards showing the total number of tasks, how many are Pending, In Progress, and Completed. Each card glows red and lifts slightly when you hover over it. Below is a two-column grid — the left side shows team member cards with progress bars and badge counts, and the right side shows a priority breakdown with coloured bars and an SVG ring chart showing the overall completion percentage. At the bottom is a list of the six most recent tasks. The page files are `Dashboard.js` and `Dashboard.css`.

### Tasks
<img width="1917" height="939" alt="image" src="https://github.com/user-attachments/assets/653ba785-ce0a-4031-b487-ecf500400c49" />

This is the main working page. It shows all tasks as cards in either a list or grid layout. At the top there are four clickable stat cards — clicking Pending, for example, instantly filters the list to show only pending tasks. Below is a control bar with a search box, four dropdowns (filter by status, user, priority, and sort order), and view-toggle buttons for list, grid, and group-by-status modes.

Each task card shows the task ID in TM-001 format, a priority badge, a due-date label (with colour coding for overdue, today, soon), and a status badge. At the bottom of each card are the assigned users as avatar circles and Edit and Delete buttons.

Clicking a card opens a detail modal with the full description, progress bar, assignee list, and due date. Clicking Edit opens the task form where you can change everything including the assignees (using a scrollable checkbox list). The page files are `TaskManager.js` and `TaskManager.css`.

### Employees
<img width="1918" height="939" alt="image" src="https://github.com/user-attachments/assets/1dd5230f-0ef3-41fe-a96a-93747d8013bf" />

This page shows every user as a card in a grid. Each card displays the person's name initial as a coloured avatar, and four stat numbers: total tasks assigned, active tasks, completed tasks, and high-priority tasks. Hovering over a card lifts it and adds a red border glow. Clicking a card expands it to show up to five of the person's tasks. The page files are `Employees.js` and `Employees.css`.

### Bug Tracker
<img width="1919" height="942" alt="image" src="https://github.com/user-attachments/assets/7acbc08a-757b-4c89-8e71-7ec83350d8bf" />

This is where team members log technical problems. There are four stat cards at the top (Total, Open, In Progress, Resolved). Below is a search bar and two filter dropdowns. Each bug appears as a card showing a BUG-001 ID, priority badge, status badge, title, and description. The card shows who reported the bug and who it is assigned to.

The "Report Bug" button opens a form modal where you fill in the title, description, status, priority, and who to assign it to. The assign dropdown shows all users in the system. If the form fails to submit, an inline red error message appears directly inside the form so it is impossible to miss. The page files are `Bugs.js` and `Bugs.css`.

### Reports
<img width="1919" height="940" alt="image" src="https://github.com/user-attachments/assets/072c605d-8580-49f9-a2af-1a72ed8d1bad" />

This page is for managers. The top row has four KPI cards: Total Tasks, Completion Rate, Overdue Tasks, and Team Members. Below is a two-column grid — the left card shows a horizontal bar chart of task distribution by status, and the right card shows three circular SVG charts for High, Medium, and Low priority tasks. At the bottom is a full-width team performance table listing every team member with their total tasks, completed tasks, high-priority tasks, and a completion progress bar. The page files are `Reports.js` and `Reports.css`.


---


## Animations, Hover Effects, and Visual Features

### Animated Background Bars

Seven vertical bars rise and fall in the background on every page. They are a deep maroon colour with a gradient that fades to transparent at the top. Each bar has a slightly different height, width, animation speed, and delay, so they move independently and create a layered, breathing effect. The animation uses CSS keyframes that scale the bar from nearly invisible (scaleY 0.05) to full height (scaleY 1) and back. The colours are set at around 58 percent opacity so they are clearly visible but do not distract from the content.

### Login Title Glow

The "Task Management System" title on the login page has a layered text-shadow that creates a deep red glow effect. When you hover over the title, it slightly grows in size (scale 1.045) and the letter spacing increases while the glow brightens. This gives it a premium, interactive feel.

### Card Hover Effects

Every card across all pages responds to hover. The card lifts upward by 2-3 pixels using CSS transform translateY. The border changes from a subtle dark line to a glowing maroon outline. A box-shadow with a slight maroon tint appears around the card. These effects use CSS transitions so the movement is smooth. The task cards in the Tasks page, bug cards in Bug Tracker, stat cards in Dashboard, KPI cards in Reports, and employee cards in Employees all behave this way.

### Sidebar

The left sidebar is a glass-effect panel (glassmorphism). It uses backdrop-filter blur so whatever is behind it appears softened. The active navigation item has a solid maroon background and a 3-pixel maroon left border. The sidebar can be collapsed from 230 pixels wide to 64 pixels wide using the toggle arrow button. When collapsed, only the icons remain visible. The collapse and expand animate smoothly using CSS transitions.

### Admin Popup

Clicking the user avatar at the bottom of the sidebar opens a small popup dialog. It shows the username, User ID, role, and session status. There is a Sign Out button. The popup slides up with a subtle animation (translateY from +8px to 0).

### Notification Bell

The bell icon in the top-right corner shows a red badge with an unread count when new tasks have been created. Clicking the bell opens a dropdown showing the notification messages with timestamps in American format. Clicking the bell again marks everything as read and the badge disappears. Notifications are stored in localStorage so they persist between page refreshes.

### Progress Bars

Tasks, Dashboard, and Reports all use animated progress bars. They fill from left to right when the page loads, using a CSS transition of 0.7 seconds ease. The colour of each bar matches the item it represents — green for completed, blue for in progress, orange for pending.

### Toast Notifications

After any create, update, or delete action, a small coloured notification appears in the top-right corner of the screen. A green toast means success. A red toast means something went wrong. The toast fades in, stays for 3.5 seconds, then disappears. Toasts appear at 60px from the top so they never overlap the topbar.

### Due Date Labels

Task cards show a colour-coded due date label. If the task is overdue, it shows in red with the number of days past due. If due today, it shows in amber. If due within three days, it shows in orange. Otherwise it shows in green with the days remaining.


---


## How This Is Useful for a Company

A corporate IT team deals with incidents, feature requests, deployments, security patches, and internal projects all at the same time. This system lets managers:

Assign work fairly by seeing each person's load on the Employees page before adding more tasks.

Spot problems early by filtering the task list by overdue items or High priority.

Reduce meetings by replacing status update meetings with the Dashboard, which shows everything at a glance.

Handle bug escalations through the Bug Tracker, where a blocked developer can log the issue and a senior engineer can pick it up without needing a meeting.

Track delivery history with soft-deleted tasks that are never lost from the database.

Show leadership a one-page performance summary using the Reports page, which shows completion rates and team progress without any manual work.


---


## Non-Functional Requirements Met

Readable and maintainable code — every file has comments explaining what each function does. The code follows consistent naming and is split into small, focused modules.

Basic security best practices — JWT tokens expire after 24 hours. Protected routes reject requests without a valid token. Passwords are validated for minimum length.

Error handling and logging — every API endpoint wraps its logic in try/catch and returns meaningful error messages. The frontend shows inline form errors and toast notifications so users always know what went wrong.

Clear documentation — README.md covers setup, credentials, and structure. API_DOCS.md covers every endpoint with request and response formats. This document covers the full project explanation.


---


## Summary

The Task Management System is a complete full-stack web application built with React on the frontend and Node.js with Express and SQLite on the backend. It covers the full lifecycle of work management — creating tasks with multiple assignees, filtering and searching, tracking bugs, viewing team performance, and receiving notifications when new work is added.

The design uses a dark glassmorphism aesthetic with animated maroon background bars, hover glow effects on all interactive elements, and a collapsible sidebar for efficient navigation. The top bar is built as a sticky element inside the content column so it never overlaps page headings regardless of scroll position. All features are wired to a real REST API with JWT authentication, database persistence, and proper error handling throughout.

The project is production-ready for a demonstration environment and follows all the non-functional requirements of readable code, security best practices, error handling, and clear documentation.
