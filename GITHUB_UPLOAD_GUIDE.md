# How to Upload This Project to GitHub

Follow these steps exactly. You only need to do this once.

---

## Step 1 — Create a `.gitignore` file

Before uploading, you need to tell Git to ignore large folders like `node_modules` and sensitive files.

Create a file called `.gitignore` in `C:\Users\Dell\task-management-system\` with this content:

```
# Node modules (very large — always ignored)
node_modules/
backend/node_modules/
frontend/node_modules/

# Database file (local only)
backend/database.db

# Environment variables (never share secrets)
backend/.env
.env

# Build output
frontend/build/

# OS files
.DS_Store
Thumbs.db
```

---

## Step 2 — Initialize a Git Repository

Open a terminal (Git Bash or Command Prompt) and run these commands one by one:

```bash
cd C:\Users\Dell\task-management-system

git init
git add .
git commit -m "Initial commit: Task Management System"
```

You should see a list of files being added and a commit confirmation.

---

## Step 3 — Create a Repository on GitHub

1. Go to **https://github.com** and sign in
2. Click the **+** button (top right) → **New repository**
3. Fill in:
   - **Repository name:** `task-management-system`
   - **Description:** `Full-stack Task Management System built with Node.js, Express, SQLite, and React`
   - Set to **Public** (so they can view it)
   - **Do NOT** check "Add a README file" (you already have one)
4. Click **Create repository**

---

## Step 4 — Connect and Push

GitHub will show you commands. Use these (replace `YOUR_USERNAME` with your actual GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/task-management-system.git
git branch -M main
git push -u origin main
```

When prompted, enter your GitHub username and password (or personal access token if you have 2FA enabled).

---

## Step 5 — Verify

Go to `https://github.com/YOUR_USERNAME/task-management-system` — you should see all your files there including the README displayed on the page.

---

## If You Make Changes Later

After making any code changes, run:

```bash
git add .
git commit -m "Description of what you changed"
git push
```

---

## Creating a Personal Access Token (if needed)

If GitHub asks for a token instead of a password:
1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Click **Generate new token**
3. Give it a name, set expiry, check **repo** scope
4. Copy the token and use it as your password when pushing

---

## Repository Structure That Reviewers Will See

```
task-management-system/
├── README.md                   ← Project overview and setup instructions
├── API_DOCUMENTATION.md        ← All API endpoints documented
├── backend/                    ← Node.js + Express + SQLite
│   ├── server.js
│   ├── config/db.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── seed.js
│   └── package.json
└── frontend/                   ← React application
    ├── src/
    │   ├── App.js
    │   ├── Components/
    │   └── services/
    └── package.json
```

---

## Paths Summary for Your Submission

| Item | Path |
|------|------|
| **Backend root** | `C:\Users\Dell\backend` |
| **Frontend root** | `C:\Users\Dell\task-management-system\frontend` |
| **Database file** | `C:\Users\Dell\backend\database.db` |
| **Backend entry point** | `C:\Users\Dell\backend\server.js` |
| **Frontend entry point** | `C:\Users\Dell\task-management-system\frontend\src\App.js` |
| **GitHub repository** | `https://github.com/YOUR_USERNAME/task-management-system` |

---

## Non-Functional Requirements Checklist

| Requirement | How It's Met |
|-------------|-------------|
| **Readable, maintainable code** | Every file has comments explaining what it does. Consistent naming conventions. Separated into controllers/models/routes. |
| **Basic security best practices** | JWT tokens for all protected routes. No SQL injection (parameterized queries). Passwords never returned in API responses. CORS configured. |
| **Error handling and logging** | All API endpoints use try/catch. Meaningful error messages returned. Console logging for server startup and DB events. Non-2xx status codes returned for all error cases. |
| **Clear documentation** | README.md with architecture explanation. API_DOCUMENTATION.md with all endpoints. Inline code comments throughout. |
