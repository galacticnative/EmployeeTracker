const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

// Get single employee
router.get('/employee/:id', (req, res) => {
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
router.delete('/api/employee/:id', (req, res) => {
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
router.post('/employee', ({ body }, res) => {
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
router.get('/employee', (req, res) => {
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

router.put('/employee/:id', (req, res) => {
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

module.exports = router;