--create table
create table Users(
                      ID serial primary key,
                      Username varchar(255) not null,
                      Email varchar(320),
                      PasswordHash varchar(255) not null,
                      Salt varchar(255) not null
);

--populate table

select * from users;