// models/taskModel.js — Multiple assignees + soft delete + server-side filtering
const db = require('../config/db');

// Parse "id:name|id:name" string into [{id,username}] array
const parseAssignees = (raw) => {
  if (!raw) return [];
  const seen = new Set();
  return raw.split('|').filter(Boolean).reduce((acc, part) => {
    const [id, username] = part.split(':');
    if (id && username && !seen.has(id)) {
      seen.add(id);
      acc.push({ id: Number(id), username });
    }
    return acc;
  }, []);
};

const getAllTasks = (filters = {}, pagination = {}) => {
  return new Promise((resolve, reject) => {
    const conditions = ['t.deleted_at IS NULL'];
    const params = [];

    if (filters.status)           { conditions.push('t.status = ?');                    params.push(filters.status); }
    if (filters.priority)         { conditions.push("COALESCE(t.priority,'Medium') = ?");params.push(filters.priority); }
    if (filters.assigned_user_id) { conditions.push('ta2.user_id = ?');                 params.push(Number(filters.assigned_user_id)); }
    if (filters.search) {
      conditions.push('(t.title LIKE ? OR t.description LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    let orderBy = 'ORDER BY t.id DESC';
    if (filters.sortBy === 'oldest')   orderBy = 'ORDER BY t.id ASC';
    if (filters.sortBy === 'priority') orderBy = "ORDER BY CASE COALESCE(t.priority,'Medium') WHEN 'High' THEN 0 WHEN 'Medium' THEN 1 ELSE 2 END";
    if (filters.sortBy === 'due')      orderBy = 'ORDER BY CASE WHEN t.due_date IS NULL THEN 1 ELSE 0 END, t.due_date ASC';

    const whereClause = 'WHERE ' + conditions.join(' AND ');

    // Use a subquery to apply filters, then join assignees
    const dataSql = `
      SELECT t.*,
             GROUP_CONCAT(ta.user_id || ':' || u.username, '|') AS assignees_raw
      FROM tasks t
      LEFT JOIN task_assignees ta  ON t.id = ta.task_id
      LEFT JOIN users u            ON ta.user_id = u.id
      LEFT JOIN task_assignees ta2 ON t.id = ta2.task_id
      ${whereClause}
      GROUP BY t.id
      ${orderBy}
      ${pagination.limit ? 'LIMIT ? OFFSET ?' : ''}
    `;

    const allParams = [...params];
    if (pagination.limit) {
      allParams.push(Number(pagination.limit), ((Number(pagination.page)||1)-1)*Number(pagination.limit));
    }

    db.all(dataSql, allParams, (err, rows) => {
      if (err) return reject(err);
      const tasks = rows.map(r => ({
        ...r,
        priority:  r.priority || 'Medium',
        assignees: parseAssignees(r.assignees_raw),
        assignees_raw: undefined,
      }));
      resolve({ tasks, total: tasks.length });
    });
  });
};

const getTaskById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT t.*, GROUP_CONCAT(ta.user_id || ':' || u.username, '|') AS assignees_raw
       FROM tasks t
       LEFT JOIN task_assignees ta ON t.id = ta.task_id
       LEFT JOIN users u ON ta.user_id = u.id
       WHERE t.id = ? AND t.deleted_at IS NULL
       GROUP BY t.id`,
      [id],
      (err, row) => {
        if (err) return reject(err);
        if (!row)  return resolve(null);
        resolve({ ...row, priority: row.priority||'Medium', assignees: parseAssignees(row.assignees_raw) });
      }
    );
  });
};

const createTask = (newTask) => {
  return new Promise((resolve, reject) => {
    const primaryId = newTask.assignee_ids?.[0] || newTask.assigned_user_id;
    db.run(
      `INSERT INTO tasks (title,description,status,assigned_user_id,priority,due_date) VALUES (?,?,?,?,?,?)`,
      [newTask.title, newTask.description, newTask.status, primaryId, newTask.priority||'Medium', newTask.due_date||null],
      function(err) {
        if (err) return reject(err);
        const taskId = this.lastID;
        const ids = [...new Set((newTask.assignee_ids||[primaryId]).map(Number).filter(Boolean))];
        Promise.all(ids.map(uid =>
          new Promise((res,rej) => db.run('INSERT OR IGNORE INTO task_assignees(task_id,user_id) VALUES(?,?)',[taskId,uid],e=>e?rej(e):res()))
        )).then(() => resolve({ id: taskId, ...newTask, priority: newTask.priority||'Medium' })).catch(reject);
      }
    );
  });
};

const updateTask = (id, updatedTask) => {
  return new Promise((resolve, reject) => {
    const primaryId = updatedTask.assignee_ids?.[0] || updatedTask.assigned_user_id;
    db.run(
      `UPDATE tasks SET title=?,description=?,status=?,assigned_user_id=?,priority=?,due_date=? WHERE id=? AND deleted_at IS NULL`,
      [updatedTask.title, updatedTask.description, updatedTask.status, primaryId, updatedTask.priority||'Medium', updatedTask.due_date||null, id],
      function(err) {
        if (err) return reject(err);
        const changes = this.changes;
        if (changes === 0) return resolve({ changes: 0 });
        db.run('DELETE FROM task_assignees WHERE task_id=?', [id], (delErr) => {
          if (delErr) return reject(delErr);
          const ids = [...new Set((updatedTask.assignee_ids||[primaryId]).map(Number).filter(Boolean))];
          Promise.all(ids.map(uid =>
            new Promise((res,rej) => db.run('INSERT OR IGNORE INTO task_assignees(task_id,user_id) VALUES(?,?)',[id,uid],e=>e?rej(e):res()))
          )).then(() => resolve({ changes })).catch(reject);
        });
      }
    );
  });
};

const deleteTask = (id) => {
  return new Promise((resolve, reject) => {
    db.run(`UPDATE tasks SET deleted_at=datetime('now') WHERE id=? AND deleted_at IS NULL`,[id],
      function(err){ if(err) reject(err); else resolve({changes:this.changes}); });
  });
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
