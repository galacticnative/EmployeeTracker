INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Posh', 'Spice', 1, 3), 
    ('Mel', 'Brown', 2, 4), 
    ('Emma', 'Bunton', 3, 5), 
    ('Melanie', 'Chisolm', 4, 3), 
    ('Geri', 'Haliwell', 5, 4);

INSERT INTO department (name)
VALUES 
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Lead Engineer', 150000, 1),
    ('Software Engineer', 120000, 1),
    ('Accountant', 125000, 2),
    ('Lead Legal Counsel', 250000, 3),
    ('Lawyer', 190000, 3),
    ('Sales Lead', 100000, 4),
    ('Salesperson', 80000, 4);


    
