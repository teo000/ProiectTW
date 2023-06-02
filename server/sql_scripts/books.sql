--create books tables
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
--sunt 11mii de carti din vre 55k care nu au vreunul din aceste genres,
--as putea sa le sterg? sau sa le las
--am incercat sa le sterg si mi zice ca it violates cv fk constraint si am lasat asa
delete from books where books.title in(
    select b.title
    from books b
             left join book_genre on b.id = book_genre.book_id where book_genre.genre_id is null);
select * from genres;

