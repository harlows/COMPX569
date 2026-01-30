-- Your database initialisation SQL here

drop table if exists articles;
drop table if exists users;

create table if not exists users (
    id int not null auto_increment,
    username varchar(64) not null,
    password varchar(255) not null,
    name varchar(64),
    dob date,
    description varchar(400),
    avatar varchar(255),
    primary key (id),
    -- prevent duplicate accounts at the database level
    constraint unique_username unique (username)
);

create table if not exists articles (
    id int not null auto_increment,
    author_id int not null,
    title varchar(255),
    content text,
    image_path varchar(255),
    -- automatically manage timestamps for article creation and updates
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    primary key (id),
    foreign key (author_id) references users (id)
    -- when an author is deleted their articles are deleted too
    on delete cascade
);

-- For testing

insert into articles (author_id, title, content) values
    (1, 'Using Profiles with Docker Compose',
    'In this setup, the backend, frontend, and database form the core of the application and are started by default because we did not assign any profiles to them.'
    );
    (2, 'Is Learning CSS a Waste of Time in 2026?',
    'With modern frameworks, component libraries, and utility-first CSS, it’s a fair question.'
    );    