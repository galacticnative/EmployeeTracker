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
            'View Departments',
            'View Roles', 
            'View by Manager', 
            'Add Employee',
            'Add Department',
            'Add Role', 
            'Update Role', 
            ]
        }
    ])
    .then(choice => {
        if (choice.viewAll === 'View ALL Employees') {
            readEmployees();
        } else if (choice.viewAll === 'View Departments') {
            viewDepartment();
        } else if (choice.viewAll === 'View by Manager') {
            viewManager();
        } 
        else if (choice.viewAll === 'View Roles') {
            viewRoles();
        }
        else if (choice.viewAll === 'Update Role') {
            updateRole();
        }
    })

        function readEmployees() {
            console.log('Viewing all Employees');
            //connection.query(`SELECT * FROM employee`,
            connection.query(`
            SELECT employee.*, 
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
                `SELECT id, name
                FROM department`,
                function(err, res) {
                    if (err) throw err;
                    console.table(res);
                    promptQuestions();
                });
        };

        function viewManager() {
            console.log('viewing managers');
            connection.query(
                `SELECT first_name, last_name, manager
                FROM employee`,
                function(err, res) {
                    if(err) throw err;
                    console.table(res);
                    promptQuestions();
                });
        };

        function viewRoles() {
            console.log('Viewing all ROLES');
            connection.query(
                `SELECT 
                role.id AS ID,
                role.title AS title,
                role.salary AS $ALARY,
                department.name AS department
                FROM role
                LEFT JOIN department ON role.department_id = department.id`,
                function(err, res) {
                    if(err) throw err;
                    console.table(res);
                    promptQuestions();
                });
        };

        function addDepartment() {
            return inquirer.prompt([
        
                {
                    type: 'input',
                    name: 'departmentname',
                    message: 'Provide a new DEPARTMENT',
                    validate: departmentInput => {
                      if (departmentInput) {
                        return true;
                      } else {
                        console.log('Please enter a Department name!');
                        return false;
                      }
                    }
                },
            ])
            .then()
        };

        function updateRole() {
            return inquirer.prompt([
        
                {
                    type: 'input',
                    name: 'departmentname',
                    message: 'Provide a new DEPARTMENT',
                    validate: departmentInput => {
                      if (departmentInput) {
                        return true;
                      } else {
                        console.log('Please enter a Department name!');
                        return false;
                      }
                    }
                },
            ])
            .then(storeRole => {
                if(storeRole === departmentInput) {

                }
            })

            console.log('updating role');
            const sql = `UPDATE department SET name = ? WHERE id = ?`;
            const params = [req.body.name, req.params.id];
            connection.query( 
            function(err, res) {
                if (err) throw err;
                console.data(res);
            });
        }
    
}


promptQuestions();
