// config/db.js
const sqlite3 = require('sqlite3').verbose(); // Enable verbose mode for better error messages
const db = new sqlite3.Database('./database.db'); // Open or create the SQLite database file

db.serialize(() => {
  // serialize() ensures all queries below run one after another (not in parallel)

  // Create the users table if it doesn't exist yet
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT    NOT NULL,
      password TEXT    NOT NULL
    )
  `);

  // Create the tasks table if it doesn't exist yet
  // assigned_user_id links each task to a user in the users table
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      title            TEXT    NOT NULL,
      description      TEXT,
      status           TEXT    DEFAULT 'Pending',
      assigned_user_id INTEGER,
      priority         TEXT    DEFAULT 'Medium',
      due_date         TEXT,
      FOREIGN KEY (assigned_user_id) REFERENCES users(id)
    )
  `);

  // ── Schema migrations (all safe — errors silently ignored if column already exists) ─────

  // Add priority column to existing DBs (ignored if already exists)
  db.run(`ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT 'Medium'`, () => {});

  // Add due_date column to existing DBs (ignored if already exists)
  db.run(`ALTER TABLE tasks ADD COLUMN due_date TEXT`, () => {});

  // Add soft-delete column — NULL means active, ISO timestamp means deleted
  db.run(`ALTER TABLE tasks ADD COLUMN deleted_at TEXT`, () => {});

  // ── Data migrations ──────────────────────────────────────────────────────────────────
  // Back-fill NULL priority values to 'Medium' for all pre-existing tasks
  // (SQLite ALTER TABLE DEFAULT only applies to new inserts, not existing rows)
  db.run(`UPDATE tasks SET priority = 'Medium' WHERE priority IS NULL`, () => {});

  // ── Performance indexes ──────────────────────────────────────────────────────────────
  // Speeds up filtering queries on the most common WHERE/ORDER BY columns
  db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_status          ON tasks(status)`,           () => {});
  db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_priority        ON tasks(priority)`,         () => {});
  db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_assigned_user   ON tasks(assigned_user_id)`, () => {});
  db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_deleted_at      ON tasks(deleted_at)`,       () => {});
  db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_due_date        ON tasks(due_date)`,         () => {});

  // Seed a default admin user so the app works right away
  // Uses "WHERE NOT EXISTS" so it only inserts if the user isn't already there
  db.run(
    `INSERT INTO users (username, password)
     SELECT 'admin', 'password'
     WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')`,
    (err) => {
      if (!err) console.log('Default user ready — username: admin, password: password');
    }
  );

  // task_assignees many-to-many table
  db.run(`CREATE TABLE IF NOT EXISTS task_assignees (
    task_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (task_id, user_id),
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`, () => {});
  db.run(`CREATE INDEX IF NOT EXISTS idx_ta_task ON task_assignees(task_id)`, () => {});
  db.run(`CREATE INDEX IF NOT EXISTS idx_ta_user ON task_assignees(user_id)`, () => {});
  // Migrate existing single assignments to task_assignees
  db.run(`INSERT OR IGNORE INTO task_assignees (task_id, user_id) SELECT id, assigned_user_id FROM tasks WHERE assigned_user_id IS NOT NULL AND deleted_at IS NULL`, () => {});
  // Create extra users for multi-assignee demo
  db.run(`INSERT INTO users (username, password) SELECT 'admin1','password' WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='admin1')`, () => {});
  db.run(`INSERT INTO users (username, password) SELECT 'admin2','password' WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='admin2')`, () => {});
  db.run(`INSERT INTO users (username, password) SELECT 'admin3','password' WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='admin3')`, () => {});
  db.run(`INSERT INTO users (username, password) SELECT 'alice','password' WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='alice')`, () => {});
  db.run(`INSERT INTO users (username, password) SELECT 'bob','password' WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='bob')`, () => {});
  // Bugs table
  db.run(`CREATE TABLE IF NOT EXISTS bugs (
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
  )`, () => {});
  db.run(`CREATE INDEX IF NOT EXISTS idx_bugs_status ON bugs(status)`, () => {});
  db.run(`CREATE INDEX IF NOT EXISTS idx_bugs_priority ON bugs(priority)`, () => {});
});

module.exports = db; // Export the db connection for use in models
