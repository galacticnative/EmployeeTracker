const inquirer = require('inquirer');
const Manager = require('./lib/Manager');
const Employee = require('./lib/Employee');
const Role = require('./lib/Role');
const Department = require('./lib/Department');
const connection = require('./db/database');

const employeeData = [];

console.log(
        `
        ********************************************************
        ********************************************************

                WELCOME TO EMPLOYEE TRACKER

        ********************************************************
        ********************************************************
        `
)
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
            } 
            else if (choice.viewAll === 'View Departments') {
                viewDepartment();
            } 
            else if (choice.viewAll === 'View by Manager') {
                viewManager();
            }
            else if (choice.viewAll === 'View Roles') {
                viewRoles();
            }
            else if (choice.viewAll === 'Add Department') {
                addDepartment();
            }
            else if (choice.viewAll === 'Add Role') {
                addRole();
            }
            else if (choice.viewAll === 'Add Employee') {
                addEmployee();
            }
            else if (choice.viewAll === 'Update Role') {
                updateRole();
            }
        })

    function readEmployees() {
        console.log('Viewing all Employees');
        //connection.query(`SELECT * FROM employee`,
        connection.query(`
            SELECT 
            employee.id AS ID,
            employee.first_name AS FirstName,
            employee.last_name AS LastName,
            employee.manager AS Manager,
            role.title AS Title, 
            role.salary AS $alary,
            department.name AS Department
            FROM employee
            LEFT JOIN role ON employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            `,
            function (err, res) {
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
            function (err, res) {
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
            function (err, res) {
                if (err) throw err;
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
            function (err, res) {
                if (err) throw err;
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
            .then(storeDept => {
                const newDept = storeDept.departmentname

                console.log('updating Department');
                const sql = `INSERT INTO department (name) VALUES (?)`;
                const params = [newDept];
                connection.query(sql, params, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(`================
                        SUCCESSFULLY added Department
                        =============================`);
                });
                promptQuestions();
            })
    };

    function addRole() {
        connection.promise().query(`
        SELECT department.name, department.id FROM department
        `)
        .then(([rows])=> {
            var departments = rows.map(({name, id}) => ({
                name: name,
                value: id
                
            }));
        
            console.log(rows)
            return inquirer.prompt([

                {
                    type: 'input',
                    name: 'roletitle',
                    message: 'Provide a new Role TITLE',
                    validate: roleTitleInput => {
                        if (roleTitleInput) {
                            return true;
                        } else {
                            console.log('Please enter a Role TITLE!');
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'rolesalary',
                    message: 'Provide a new Role SALARY',
                    validate: roleSalaryInput => {
                        if (roleSalaryInput) {
                            return true;
                        } else {
                            console.log('Please enter a Role SALARY')
                        }
                    }

                },
                {
                    type: 'list',
                    name: 'roledept',
                    message: 'Provide select a DEPARTMENT',
                    choices: departments

                },
            ])
                .then(({roletitle, rolesalary, roledept}) => {
                    

                    console.log('updating Role');
                    const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                    const params = [roletitle, rolesalary, roledept];
                    connection.query(sql, params, function (err, res) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(`================
                            SUCCESSFULLY added Role
                            =============================`);
                    });
                    promptQuestions();
                })
    
            })        
    };

    function addEmployee() {
        connection.promise().query(`
        SELECT role.id, role.title FROM role
        `)
        .then(([rows])=> {
            var roles = rows.map(({id, title}) => ({
                name: title,
                value: id
                
            }));
        
            console.log(rows)
            return inquirer.prompt([

                {
                    type: 'input',
                    name: 'firstname',
                    message: 'Provide employee FIRST NAME',
                    validate: firstNameInput => {
                        if (firstNameInput) {
                            return true;
                        } else {
                            console.log('Please enter FIRST NAME!');
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'lastname',
                    message: 'Provide employee LAST NAME',
                    validate: lastNameInput => {
                        if (lastNameInput) {
                            return true;
                        } else {
                            console.log('Please enter LAST NAME')
                        }
                    }

                },
                {
                    type: 'list',
                    name: 'roleselect',
                    message: 'Provide select a ROLE',
                    choices: roles

                },
            ])
                .then(({firstname, lastname, roleselect}) => {
                    

                    console.log('updating employee');
                    const sql = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`;
                    const params = [firstname, lastname, roleselect];
                    connection.query(sql, params, function (err, res) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(`=================================
                                        SUCCESSFULLY added EMPLOYEE
                                    ==================================
                            `);
                    });
                    promptQuestions();
                })
    
            })
    };

    function updateRole() {
        connection.promise().query(`
        SELECT employee.last_name, employee.id, role.id, role.title 
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        `)
        .then(([rows])=> {
            var employees = rows.map(({ last_name, id }) => ({
                name: last_name,
                value: id   
            }))
            var roles = rows.map(({ id, title }) => ({
                name: title,
                value: id
            })
            );
        
            console.log(rows)
            return inquirer.prompt([

                {
                    type: 'list',
                    name: 'employeelist',
                    message: 'Select an Employee',
                    choices: employees
                },
                {
                    type: 'list',
                    name: 'rolelist',
                    message: 'Select a Role',
                    choices: roles
                }
            ])
            .then(({employeelist, rolelist}) => {
                

                console.log('updating Role');
                const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                const params = [employeelist, rolelist];
                connection.query(sql, params, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(`=================================
                                    SUCCESSFULLY updated Role
                                ==================================
                        `);
                });
                promptQuestions();
            })

        })
    };
}

promptQuestions();
