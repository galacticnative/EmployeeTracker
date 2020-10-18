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

INSERT INTO employee (first_name, last_name, role_id, manager)
VALUES 
    ('Posh', 'Spice', 1, NULL), 
    ('Mel', 'Brown', 2, 'Posh Spice'), 
    ('Emma', 'Bunton', 3, NULL), 
    ('Melanie', 'Chisolm', 7, 'Geri Haliwell'), 
    ('Geri', 'Haliwell', 6, NULL),
    ('Britney', 'Spears', 5, 'Fleetwood Mac'),
    ('Fleetwood', 'Mac', 4, NULL);
    
