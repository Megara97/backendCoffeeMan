DROP DATABASE IF EXISTS coffeeman_db;

CREATE DATABASE IF NOT EXISTS coffeeman_db;

USE coffeeman_db;

DROP TABLE IF EXISTS products;

CREATE TABLE IF NOT EXISTS products (
	product_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(20) NOT NULL UNIQUE,
    product_price DECIMAL(10,2) NOT NULL,
    product_status BOOLEAN NOT NULL DEFAULT (TRUE),
    PRIMARY KEY(product_id)
);

INSERT INTO products(product_name, product_price)
VALUES
('Americano',30),
('Macchiato',35),
('Flat White',35),
('Capuchino',38),
('Latte',40);

DROP TABLE IF EXISTS commands;

CREATE TABLE commands (
	command_id INT NOT NULL auto_increment,
    total DECIMAL(10,2) NOT NULL,
    tip DECIMAL(10,2) NOT NULL,
    method BOOLEAN NOT NULL,
    paid_date TIMESTAMP NOT NULL DEFAULT (NOW()),
    primary key(command_id)
);

INSERT INTO commands(total,tip,method)
VALUES
(150,15,1),
(90,10,0),
(76,14,1);

DROP TABLE IF EXISTS commandsdetails;

CREATE TABLE commandsdetails (
	command_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    foreign key(command_id) references commands(command_id),
    foreign key(product_id) references products(product_id),
    primary key(product_id,command_id)
);

-- Agregar un constraint para que no se agreguen productos con cantidad 0 a commandsdetails
ALTER TABLE commandsdetails
ADD CONSTRAINT check_quantity
CHECK (quantity > 0);

INSERT INTO commandsdetails(command_id,product_id,quantity)
VALUES
(1,2,2),
(1,5,2),
(2,1,3),
(3,4,2);