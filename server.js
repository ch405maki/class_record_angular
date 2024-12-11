const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database (persistent storage)
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    // Create the `users` table if it doesn't exist
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentID TEXT NOT NULL UNIQUE, 
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        courses TEXT -- Stores courses as a JSON array
      )`,
      (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
        } else {
          console.log('Users table ready');
        }
      }
    );
  }
});

// Routes

// Add a user
app.post('/users', (req, res) => {
  const { studentID, name, email, password, courses } = req.body;
  if (!studentID || !name || !email || !password) {
    return res.status(400).json({
      error: 'Student ID, name, email, and password are required',
    });
  }

  const coursesData = JSON.stringify(courses || []); // Convert courses to JSON array
  const query = `INSERT INTO users (studentID, name, email, password, courses) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [studentID, name, email, password, coursesData], function (err) {
    if (err) {
      console.error('Error inserting user:', err.message);
      if (err.message.includes('UNIQUE constraint failed')) {
        res
          .status(400)
          .json({ error: 'Student ID or email already exists' });
      } else {
        res.status(500).json({ error: 'Failed to add user' });
      }
    } else {
      res.status(201).json({
        id: this.lastID,
        studentID,
        name,
        email,
        courses: JSON.parse(coursesData),
      });
    }
  });
});

// Fetch all users
app.get('/users', (req, res) => {
  const query = `SELECT id, studentID, name, email, courses FROM users`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err.message);
      res.status(500).json({ error: 'Failed to fetch users' });
    } else {
      const users = rows.map((user) => ({
        ...user,
        courses: user.courses ? JSON.parse(user.courses) : [],
      }));
      res.json(users);
    }
  });
});

// Fetch a single user by ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = `SELECT id, studentID, name, email, courses FROM users WHERE id = ?`;

  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Error fetching user:', err.message);
      res.status(500).json({ error: 'Failed to fetch user' });
    } else if (!row) {
      res.status(404).json({ error: 'User not found' });
    } else {
      row.courses = row.courses ? JSON.parse(row.courses) : [];
      res.json(row);
    }
  });
});

// Fetch a single user by studentID
app.get('/users/student/:studentID', (req, res) => {
  const { studentID } = req.params;
  const query = `SELECT id, studentID, name, email, courses FROM users WHERE studentID = ?`;

  db.get(query, [studentID], (err, row) => {
    if (err) {
      console.error('Error fetching user:', err.message);
      res.status(500).json({ error: 'Failed to fetch user' });
    } else if (!row) {
      res.status(404).json({ error: 'User not found' });
    } else {
      row.courses = row.courses ? JSON.parse(row.courses) : [];
      res.json(row);
    }
  });
});

// Update a user's studentID or courses
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { studentID, name, email, courses } = req.body;
  
    // Ensure at least one field is provided to update
    if (!studentID && !name && !email && !courses) {
      return res.status(400).json({ error: 'At least one field is required' });
    }
  
    const fieldsToUpdate = [];
    const values = [];
  
    // Check which fields need to be updated and add them to the query
    if (studentID) {
      fieldsToUpdate.push('studentID = ?');
      values.push(studentID);
    }
  
    if (name) {
      fieldsToUpdate.push('name = ?');
      values.push(name);
    }
  
    if (email) {
      fieldsToUpdate.push('email = ?');
      values.push(email);
    }
  
    if (courses) {
      fieldsToUpdate.push('courses = ?');
      values.push(JSON.stringify(courses)); // Store courses as a JSON string
    }
  
    values.push(id);
  
    const query = `UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
  
    db.run(query, values, function (err) {
      if (err) {
        console.error('Error updating user:', err.message);
        res.status(500).json({ error: 'Failed to update user' });
      } else {
        // After update, fetch the updated user and return the full updated object
        db.get('SELECT id, studentID, name, email, courses FROM users WHERE id = ?', [id], (err, row) => {
          if (err) {
            console.error('Error fetching updated user:', err.message);
            res.status(500).json({ error: 'Failed to fetch updated user' });
          } else {
            row.courses = row.courses ? JSON.parse(row.courses) : [];
            res.json(row);  // Send the updated user as the response
          }
        });
      }
    });
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
