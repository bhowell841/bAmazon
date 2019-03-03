drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products(
    id int not null auto_increment,
    productName varchar(100) not null,
    departmentName varchar(100) not null,
    price DECIMAL(10, 2) not null,
    quantity int not null,
    primary key(id)
);
