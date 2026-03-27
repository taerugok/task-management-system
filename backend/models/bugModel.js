// models/bugModel.js
// Database query functions for the bugs table.
// All functions return Promises so controllers can use async/await.
// The bugs table schema is:
//   id, title, description, status, priority, reported_by, assigned_to, created_at

const db = require('../config/db');

// getAllBugs
// Fetches every bug report, joining the users table twice:
//   u1 → the person who reported the bug (reporter_name)
//   u2 → the person it is assigned to (assignee_name)
// LEFT JOIN means bugs with no assignee still appear (assignee_name will be NULL).
const getAllBugs = () => new Promise((resolve, reject) => {
  db.all(
    `SELECT b.*,
            u1.username AS reporter_name,
            u2.username AS assignee_name
     FROM bugs b
     LEFT JOIN users u1 ON b.reported_by = u1.id
     LEFT JOIN users u2 ON b.assigned_to  = u2.id
     ORDER BY b.id DESC`,   /* newest bug first */
    [],
    (err, rows) => {
      if (err) reject(err);
      else     resolve(rows);
    }
  );
});

// createBug
// Inserts a new row into the bugs table.
// created_at defaults to the current timestamp (set in the DB schema).
const createBug = (bug) => new Promise((resolve, reject) => {
  db.run(
    `INSERT INTO bugs (title, description, status, priority, reported_by, assigned_to)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      bug.title,
      bug.description  || '',       // description is optional
      bug.status       || 'Open',
      bug.priority     || 'Medium',
      bug.reported_by  || null,
      bug.assigned_to  || null,
    ],
    function (err) {
      if (err) reject(err);
      else     resolve({ id: this.lastID, ...bug });
    }
  );
});

// updateBug
// Updates a bug's editable fields.
// Returns { changes: 0 } if no row matched the given id (bug not found).
const updateBug = (id, bug) => new Promise((resolve, reject) => {
  db.run(
    `UPDATE bugs
     SET title=?, description=?, status=?, priority=?, assigned_to=?
     WHERE id=?`,
    [
      bug.title,
      bug.description || '',
      bug.status,
      bug.priority    || 'Medium',
      bug.assigned_to || null,
      id,
    ],
    function (err) {
      if (err) reject(err);
      else     resolve({ changes: this.changes });
    }
  );
});

// deleteBug
// Permanently removes a bug from the database.
// Returns { changes: 0 } if no row matched (already deleted or wrong id).
const deleteBug = (id) => new Promise((resolve, reject) => {
  db.run(
    `DELETE FROM bugs WHERE id=?`,
    [id],
    function (err) {
      if (err) reject(err);
      else     resolve({ changes: this.changes });
    }
  );
});

module.exports = { getAllBugs, createBug, updateBug, deleteBug };
