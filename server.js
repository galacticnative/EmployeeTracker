const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const sqlite3 = require('sqlite3').verbose();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Connect to database
const db = new sqlite3.Database('./db/business.db', err => {
    if (err) {
      return console.error(err.message);
    }
  
    console.log('Connected to the BUSINESS database.');
});

db.all(`SELECT * FROM employee`, (err, rows) => {
    console.log(rows);
});

// when user enter invalid request, must be LAST response; CATCH ALL
app.use((req, res) => {
    res.status(404).end();
});

// Start server after DB connection; must be at BOTTOM of file
db.on('open', () => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });