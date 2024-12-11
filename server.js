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
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
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
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.run(query, [name, email, password], function (err) {
    if (err) {
      console.error('Error inserting user:', err.message);
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Failed to add user' });
      }
    } else {
      res.status(201).json({ id: this.lastID, name, email });
    }
  });
});

// Fetch all users (excluding passwords for security)
app.get('/users', (req, res) => {
  const query = `SELECT id, name, email FROM users`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err.message);
      res.status(500).json({ error: 'Failed to fetch users' });
    } else {
      res.json(rows);
    }
  });
});

// Fetch a single user by ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = `SELECT id, name, email FROM users WHERE id = ?`;

  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Error fetching user:', err.message);
      res.status(500).json({ error: 'Failed to fetch user' });
    } else if (!row) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(row);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
