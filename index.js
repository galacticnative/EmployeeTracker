const inquirer = require('inquirer');
const Manager = require('./lib/Manager');
const Employee = require('./lib/Employee');
const Role = require('./lib/Role');
const Department = require('./lib/Department');
const connection = require('./db/database');

const employeeData = [];

const promptQuestions = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'viewAll',
            message: 'Select an option',
            choices: 
            ['View ALL Employees', 
            'View by Department', 
            'View by Manager', 
            'Add Employee', 
            'Remove Employee', 
            'Update Role', 
            'Update Manager']
        }
    ])
    .then(choice => {
        if (choice.viewAll === 'View ALL Employees') {
            readEmployees();
        } else if (choice.viewAll === 'View by Department') {
            viewDepartment();
        } else if (choice.viewAll === 'View by Manager') {
            viewManager();
        }
    })

        function readEmployees() {
            console.log('Viewing all Employees');
            //connection.query(`SELECT * FROM employee`,
            connection.query(`SELECT employee.*, 
            role.title AS title, role.salary AS salary
            FROM employee
            LEFT JOIN role ON employee.role_id = role.id`,
            function(err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                console.table(res);
                promptQuestions();
            });
        };

        function viewDepartment() {
            console.log('viewing by Department');
            connection.query(
                `SELECT employee.*, role.department_id 
                AS department_id 
                FROM employee 
                LEFT JOIN role 
                ON employee.role_id = role.id`,
                function(err, res) {
                    if (err) throw err;
                    console.table(res);
                    promptQuestions();
                });
        };

        function viewManager() {
            console.log('viewing managers');
            connection.query(
                `SELECT first_name, last_name, manager_id
                FROM employee`,
                function(err, res) {
                    if(err) throw err;
                    console.table(res);
                    promptQuestions();
                });
        };

        // function updateRole() {
        //     console.log('updating role');
        //     const query = connection.query(`UPDATE employee SET role_id = ? 
        //     WHERE id = ?`, [], 
        //     function(err, res) {
        //         if (err) throw err;
        //         console.log(res.affectedRows + ' role updated!!\n')
        //     }
        // );
    
}


promptQuestions();
