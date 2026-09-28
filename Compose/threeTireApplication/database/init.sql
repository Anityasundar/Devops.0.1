CREATE DATABASE IF NOT EXISTS employee_db;

USE employee_db;

CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    salary DECIMAL(10,2) NOT NULL
);

INSERT INTO employees
(name, department, email, salary)
VALUES
('Rahul Sharma', 'DevOps', 'rahul@example.com', 65000),
('Priya Singh', 'Development', 'priya@example.com', 70000),
('Arjun Kumar', 'Testing', 'arjun@example.com', 55000);
