# How to Upload This Project to GitHub

Follow these steps to push your project to GitHub.

---

## Step 1 — Create a GitHub Repository

1. Go to https://github.com and log in to your account.
2. Click the + button in the top right and choose "New repository".
3. Name it: task-management-system
4. Set it to Public (required for submission).
5. Do NOT check "Add a README" — you already have one.
6. Click "Create repository".

---

## Step 2 — Open Terminal in Your Project Folder

Open a terminal (Command Prompt or Git Bash) and navigate to your project root:

```
cd C:\Users\Dell\task-management-system
```

---

## Step 3 — Initialize Git and Push

Run these commands one by one:

```bash
git init
git add .
git commit -m "Initial commit - Task Management System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/task-management-system.git
git push -u origin main
```

Replace YOUR_USERNAME with your actual GitHub username.

---

## Step 4 — Verify

Go to https://github.com/YOUR_USERNAME/task-management-system and confirm all files are there.

---

## What to Submit

- Repository URL: https://github.com/YOUR_USERNAME/task-management-system
- The README.md is already in the repo with setup steps
- The API documentation is in API_DOCS.md
