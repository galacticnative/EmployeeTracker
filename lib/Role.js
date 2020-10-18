class Role {
    constructor(title, salary, department_id) {
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
    }

    updateRole = () => {
        console.log('updating role');
        const query = connection.query(`UPDATE employee SET role_id = ? 
        WHERE id = ?`, [], 
        function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + ' role updated!!\n')
        }
    );
    console.log(query.sql);
    };
    
}