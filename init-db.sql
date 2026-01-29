-- Your database initialisation SQL here
drop table if exists users;

create table if not exists users (
    id int not null auto_increment,
    username varchar(64) not null,
    password varchar(255) not null,
    name varchar(64),
    dob date,
    description varchar(400),
    primary key (id),
    constraint unique_username unique (username)
);