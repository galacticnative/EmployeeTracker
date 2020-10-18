const connection = require("../db/database");

class Employee {
    constructor(first_name, last_name, role_id, manager_id) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_id = role_id;
        this.manager_id = manager_id;
    }
        readEmployees = () => {
            console.log('Viewing all Employees...\n');
            connection.query(`SELECT employee.*, role.title, department.name AS
            department, CONCAT(manager.first_name, manager.last_name) AS manager
            FROM employee
            LEFT JOIN 
            role ON employee.role_id = role.id
            RIGHT JOIN
            department ON role.department_id = department.id
            LEFT JOIN
            manager ON employee.manager_id = manager.id`,
            function(err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                console.log(res);
            });
            //console.log(query.sql);
        };

        // addEmployee = () => {
        //     console.log('adding Employee');
        //     const query = connection.query(
        //         `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
        //         VALUES (?,?,?,?)`)
        // }
}
  
module.exports = Employee;