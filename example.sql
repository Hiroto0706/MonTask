drop table sessions;
drop table users;
drop table todos;
 
create table users (
  id         serial primary key,
  uuid       varchar(64) not null unique,
  email      varchar(255) not null unique,
  password   varchar(255) not null,
  created_at timestamp not null   
);
 
create table categories (
  id          serial primary key,
  name        varchar(255),
  color_id    integer not null,
  user_id     integer references users(id),
  created_at  timestamp not null
);

create table tasks (
  id          serial primary key,
  title       varchar(255),
  user_id     integer references users(id),
  category_id integer references categories(id),
  status      boolean,
  start_time  timestamp not null,
  end_time    timestamp not null,
  created_at  timestamp not null
);

