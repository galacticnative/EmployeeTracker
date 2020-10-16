const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const sqlite3 = require('sqlite3').verbose();
const inputCheck = require('./utils/inputCheck');

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

// db.all(`SELECT * FROM employee`, (err, rows) => {
//     console.log(rows);
// });

// Get single employee
app.get('/api/employee/:id', (req, res) => {
    const sql = `SELECT employee.*, role.title 
             AS title 
             FROM employee 
             LEFT JOIN role 
             ON employee.role_id = role.id
             WHERE employee.id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: row
      });
    });
});

// Delete an employee
app.delete('/api/employee/:id', (req, res) => {
    const sql = `DELETE FROM employee WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function(err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
  
      res.json({
        message: 'successfully deleted',
        changes: this.changes
      });
    });
});

// Create an employee POST
app.post('/api/employee', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'role_id', 'manager_id');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
              VALUES (?,?,?,?)`;
    const params = [body.first_name, body.last_name, body.role_id, body.manager_id];
    // ES5 function, not arrow function, to use `this`
    db.run(sql, params, function(err, result) {
    if (err) {
        res.status(400).json({ error: err.message });
        return;
    }

    res.json({
        message: 'success',
        data: body,
        id: this.lastID
    });
    });
});


// Get all employees
app.get('/api/employee', (req, res) => {
    const sql = `SELECT employee.*, role.title 
             AS title 
             FROM employee 
             LEFT JOIN role 
             ON employee.role_id = role.id`;
    const params = [];
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: rows
      });
    });
});

app.get('/api/role', (req, res) => {
    const sql = `SELECT * FROM role`;
    const params = [];
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: rows
      });
    });
});

app.get('/api/role/:id', (req, res) => {
    const sql = `SELECT * FROM role WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: row
      });
    });
});

app.delete('/api/role/:id', (req, res) => {
    const sql = `DELETE FROM role WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function(err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
  
      res.json({ message: 'successfully deleted', changes: this.changes });
    });
});

app.put('/api/employee/:id', (req, res) => {
    const errors = inputCheck(req.body, 'role_id');

    if (errors) {
    res.status(400).json({ error: errors });
    return;
    }
    
    const sql = `UPDATE employee SET role_id = ? 
                 WHERE id = ?`;
    const params = [req.body.role_id, req.params.id];
  
    db.run(sql, params, function(err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: req.body,
        changes: this.changes
      });
    });
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