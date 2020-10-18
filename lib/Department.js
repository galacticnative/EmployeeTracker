class Department {
    constructor(name) {
        this.name = name;
    }

    viewDepartment = () => {
        console.log('viewing by Department');
        const query = connection.query(
            `SELECT employee.*, role.department_id 
            AS department_id 
            FROM employee 
            LEFT JOIN role 
            ON employee.role_id = role.id`)
    }
}

module.exports = Department;