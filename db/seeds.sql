INSERT INTO departments (dept_name) VALUES ('Sales'), ('Engineering'), ('Services'), ('Product');

INSERT INTO roles (title, salary, departmentid) VALUES
    ('Account Manager', 60000, 1),
    ('Sales Manager', 160000, 1),
    ('Engineering Manager', 180000, 2),
    ('Engineer', 120000, 2),
    ('Solution Architect', 100000, 3),
    ('Project Manager', 110000, 3),
    ('Product Manager', 120000, 4),
    ('Program Manager', 120000, 4);

INSERT INTO employees (first_name, last_name, roleid, managerid) VALUES
    ('Mickey', 'Mouse', 2, NULL),
    ('Donald', 'Duck', 1, 1),
    ('Goofy', 'Dog', 1, 1),
    ('Steamboat', 'Willy', 3, NULL),
    ('Tugboat', 'Tom', 4, 4);