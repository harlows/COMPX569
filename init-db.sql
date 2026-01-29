-- Your database initialisation SQL here
drop table if exists users;
drop table if exists articles;

create table if not exists users (
    id int not null auto_increment,
    username varchar(64) not null,
    password varchar(255) not null,
    name varchar(64),
    dob date,
    description varchar(400),
    avatar varchar(100),
    primary key (id),
    constraint unique_username unique (username)
);

create table if not exists articles (
    id int not null auto_increment,
    author_id int not null,
    article_title varchar(255),
    article_contents text,
    image_path varchar(100),
    date_created timestamp default current timestamp,
    date_updated timestamp,
    primary key (id),
    foreign key (author_id) references users (id)
    on delete cascade -- when an author is deleted their articles are deleted
);

-- For testing

insert into users (username, password, name, dob) values
    ('harlow',
    '$argon2id$v=19$m=65536,t=3,p=4$9rsckgQjanVY/XMa3hJX5A$yGrmZTcVWYX4joHaMHHFRLYsur8iCoeq1FExzyQD1YE',
    'Stephen','1969-09-04');

insert into articles (author_id, article_title, article_contents) values
    (1, 'Using Profiles with Docker Compose',
    'In this setup, the backend, frontend, and database form the core of the application and are started by default because we did not assign any profiles to them.'
    );