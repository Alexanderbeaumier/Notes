require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(express.static('public'));

const db = new sqlite3.Database(':memory:');

// Initialize the database
db.serialize(() => {
  db.run('CREATE TABLE notes (id INTEGER PRIMARY KEY, title TEXT, content TEXT, created_at TEXT)');
});

// Get all notes
app.get('/notes', (req, res) => {
  db.all('SELECT * FROM notes ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(rows);
  });
});

// Add a new note
app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  const created_at = new Date().toISOString();
  db.run('INSERT INTO notes (title, content, created_at) VALUES (?, ?, ?)', [title, content, created_at], function (err) {
    if (err) {
      return console.error(err.message);
    }
    res.status(201).json({ id: this.lastID });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
