class Manager {
    constructor(manager_id) {
        this.manager_id = manager_id;
    }

    viewManager = () => {
        console.log('viewing managers');
        const query = connection.query(
            `SELECT first_name, last_name, manager_id
            FROM employee`)
    }
}

module.exports = Manager;