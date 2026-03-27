// models/userModel.js
const db = require('../config/db'); // Import the database connection

// Find a user by their username (used during login)
const findByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) reject(err);
      else resolve(row); // Returns the user row or undefined if not found
    });
  });
};

// Create a new user (used during registration)
const createUser = (username, password) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, username }); // Return the new user with their generated ID
      }
    );
  });
};

// Find a user by their ID (used by change-password, auth checks)
const findById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row); // Returns the user row or undefined
    });
  });
};

// Get all users — used to populate the "Assign to" dropdown in the task form
const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, username FROM users ORDER BY username ASC', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = { findByUsername, findById, createUser, getAllUsers };
