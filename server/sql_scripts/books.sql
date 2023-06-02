CREATE TABLE genres (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(255)
);

CREATE TABLE books (
                       id SERIAL PRIMARY KEY,
                       title varchar(100) not null,
                       author varchar(100) not null,
                       rating numeric(3,2),
                       genre_ids VARCHAR(255),
                       description varchar(2000)  ,
                       edition varchar(50)  ,
                       publisher varchar(50) ,
                       publishDate varchar(255),
                       numberOfRatings integer,
                       coverImg varchar(200)

);

CREATE TABLE book_genre (
                            book_id INT,
                            genre_id INT,
                            FOREIGN KEY (book_id) REFERENCES books(id),
                            FOREIGN KEY (genre_id) REFERENCES genres(id)
);
--change date format
UPDATE books
SET publishDate = CASE
                      WHEN publishDate ~ '^\d{1,2}/\d{1,2}/\d{4}$' THEN
                          CASE
                              WHEN to_date(publishDate, 'MM/DD/YYYY') IS NOT NULL THEN EXTRACT(YEAR FROM to_date(publishDate, 'MM/DD/YYYY')::date)::INT
                              ELSE NULL
                              END
                      WHEN publishDate ~ '^[A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?\s+\d{4}$' THEN
                          CASE
                              WHEN to_date(REGEXP_REPLACE(publishDate, '(?<=\d)(st|nd|rd|th)(?!\d)', ''), 'Month DD YYYY') IS NOT NULL THEN EXTRACT(YEAR FROM to_date(REGEXP_REPLACE(publishDate, '(?<=\d)(st|nd|rd|th)(?!\d)', ''), 'Month DD YYYY')::date)::INT
                              ELSE NULL
                              END
                      ELSE NULL
    END;

--rename column to year
alter table books
    rename column publishDate to year;


--insert genres
INSERT INTO genres (name)
SELECT DISTINCT TRIM(BOTH '[]''" ' FROM UNNEST(STRING_TO_ARRAY(genre_ids, ',')))
FROM books;

--insert associations
INSERT INTO book_genre (book_id, genre_id)
SELECT b.id, g.id
FROM books b
         JOIN unnest(string_to_array(b.genre_ids, ',')) genre_name ON TRUE
         JOIN genres g ON g.name = TRIM(BOTH '[]''" ' FROM genre_name);


--am verificat daca exista genre-urile astea
select * from genres where name like 'Biography';
select * from genres where name like 'Romance';
select * from genres where name like 'Crime';
select * from genres where name like 'Fiction';
select * from genres where name like 'Historical Fiction';
select * from genres where name like 'Self Help';
select * from genres where name like 'Young Adult';

delete from genres where name not in ('Biography',
                                      'Romance',
                                      'Crime',
                                      'Fiction',
                                      'Historical Fiction',
                                      'Self Help',
                                      'Young Adult');

-- Add the ON DELETE CASCADE constraint to the foreign keys in book_genre
ALTER TABLE book_genre
    DROP CONSTRAINT IF EXISTS book_genre_book_id_fkey, -- Drop the existing foreign key constraint
    ADD CONSTRAINT book_genre_book_id_fkey
        FOREIGN KEY (book_id)
            REFERENCES books (id)
            ON DELETE CASCADE;

ALTER TABLE book_genre
    DROP CONSTRAINT IF EXISTS book_genre_genre_id_fkey, -- Drop the existing foreign key constraint
    ADD CONSTRAINT book_genre_genre_id_fkey
        FOREIGN KEY (genre_id)
            REFERENCES genres (id)
            ON DELETE CASCADE;

--sunt 11mii de carti din vre 55k care nu au vreunul din aceste genres,
--asa ca le-am sters
delete from books where books.title in(
    select b.title
    from books b
             left join book_genre on b.id = book_genre.book_id where book_genre.genre_id is null);
select * from genres;


--delete la coloana de genres
alter table books drop column genre_ids;


create table groups(
                       id SERIAL PRIMARY KEY,
                       name varchar(100) not null,
                       adminID integer not null,
                       bookID integer,--la inceput e null asta si apoi o setezi
                       FOREIGN KEY (bookID) REFERENCES books(id) on delete set null,
                       FOREIGN KEY (adminID) REFERENCES users(id) on delete set null
);
create table group_members(
                              groupID integer not null,
                              userID integer not null,
                              FOREIGN KEY (groupID) REFERENCES groups(id) on delete cascade,
                              FOREIGN KEY (userID) REFERENCES users(id) on delete cascade
);

create table group_books --history of the books read in a group
( groupID integer not null,
  bookID integer not null,
  Date DATE,
  FOREIGN KEY (groupID) REFERENCES groups(id) on delete cascade,
  FOREIGN KEY (bookID) REFERENCES books(id) on delete cascade
);

--books read by a user
create table books_read(
                           bookID integer not null,
                           userID integer not null,
                           Rating numeric(3,2),
                           shelfID integer,
                           FOREIGN KEY (userID) REFERENCES users(id) on delete cascade,
                           FOREIGN KEY (bookID) REFERENCES books(id) on delete cascade,
                           foreign key (shelfID) REFERENCES shelves(id) on delete cascade
);

--shelves : want to read, read, idk mai ce
create table shelves(
                        id serial primary key,
                        name varchar(50) not null
);

--am dat rename ca poti avea si carti pe care nu le ai citit
alter table books_read
    rename to user_books;

--review table
create table reviews(
                        id serial primary key,
                        userID integer not null,
                        bookID integer not null,
                        Date DATE,
                        content varchar(320),--punem limita la frontend
                        stars integer,
                        likes integer,
                        FOREIGN KEY (userID) REFERENCES users(id) on delete cascade,
                        FOREIGN KEY (bookID) REFERENCES books(id) on delete cascade
);

create table comments(
                         id serial primary key,
                         reviewID integer not null,
                         userID integer not null,
                         Date DATE,
                         content varchar(320),
                         FOREIGN KEY (userID) REFERENCES users(id) on delete cascade,
                         FOREIGN KEY (reviewID) REFERENCES reviews(id) on delete cascade
)