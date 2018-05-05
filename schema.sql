drop database if exists bamazon;
create database bamazon;
use bamazon;

SELECT item_id AS ID, product_name AS Product, department_name AS Department, price AS Price, stock_quantity AS Stock
FROM products;

create table products(
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(10) NOT NULL,
    PRIMARY KEY(item_id)
);

