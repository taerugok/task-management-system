// controllers/taskController.js
const Task = require('../models/taskModel');

exports.getTasks = (req,res) => {
  const { status, assigned_user_id, priority, search, sortBy, page, limit } = req.query;
  const filters = {};
  if (status)           filters.status = status;
  if (assigned_user_id) filters.assigned_user_id = assigned_user_id;
  if (priority)         filters.priority = priority;
  if (search)           filters.search = search;
  if (sortBy)           filters.sortBy = sortBy;
  const pagination = limit ? { page: page||1, limit } : {};
  Task.getAllTasks(filters, pagination)
    .then(({tasks,total}) => res.json({ tasks, total, page: Number(page||1), limit: limit?Number(limit):total, totalPages: limit?Math.ceil(total/Number(limit)):1 }))
    .catch(err => res.status(500).json({ error: err.message }));
};

exports.getTaskById = (req,res) => {
  Task.getTaskById(req.params.id)
    .then(task => task ? res.json({task}) : res.status(404).json({error:`Task #${req.params.id} not found`}))
    .catch(err => res.status(500).json({error:err.message}));
};

exports.createTask = (req,res) => {
  const { title, description, status, assigned_user_id, priority, due_date, assignee_ids } = req.body;
  const ids = assignee_ids?.length ? assignee_ids : (assigned_user_id ? [assigned_user_id] : null);
  if (!title||!description||!status||!ids?.length)
    return res.status(400).json({error:'title, description, status and at least one assignee are required'});
  const validStatuses = ['Pending','In Progress','Completed'];
  if (!validStatuses.includes(status)) return res.status(400).json({error:`Invalid status`});
  const newTask = {
    title: title.trim(), description: description.trim(), status,
    assigned_user_id: Number(ids[0]),
    priority: priority||'Medium', due_date: due_date||null,
    assignee_ids: ids.map(Number),
  };
  Task.createTask(newTask)
    .then(task => res.status(201).json({task}))
    .catch(err => res.status(500).json({error:err.message}));
};

exports.updateTask = (req,res) => {
  const { id } = req.params;
  const { title, description, status, assigned_user_id, priority, due_date, assignee_ids } = req.body;
  const ids = assignee_ids?.length ? assignee_ids : (assigned_user_id ? [assigned_user_id] : null);
  if (!title||!description||!status||!ids?.length)
    return res.status(400).json({error:'title, description, status and at least one assignee are required'});
  const updatedTask = {
    title: title.trim(), description: description.trim(), status,
    assigned_user_id: Number(ids[0]),
    priority: priority||'Medium', due_date: due_date||null,
    assignee_ids: ids.map(Number),
  };
  Task.updateTask(id, updatedTask)
    .then(r => r.changes===0 ? res.status(404).json({error:`Task #${id} not found`}) : res.json({message:'Task updated successfully'}))
    .catch(err => res.status(500).json({error:err.message}));
};

exports.deleteTask = (req,res) => {
  Task.deleteTask(req.params.id)
    .then(r => r.changes===0 ? res.status(404).json({error:`Task not found`}) : res.json({message:'Task deleted successfully'}))
    .catch(err => res.status(500).json({error:err.message}));
};
