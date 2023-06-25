INSERT INTO top_books (genre, book_id, rank)
SELECT 'any', id, rank
FROM (
         select b.id, ROW_NUMBER() OVER (ORDER BY rating DESC) AS rank from books b
        order by rating desc
         LIMIT 3
     ) AS top_books_data;
	 
	 INSERT INTO top_books (genre, book_id, rank)
SELECT 'romance', id, rank
FROM (
         select b.id, ROW_NUMBER() OVER (ORDER BY rating DESC) AS rank from books b
                                                                       join book_genre bg on b.id = bg.book_id
                                                                       join genres g on g.id = bg.genre_id
                                                                       where lower(g.name) like 'romance'
        order by rating desc
         LIMIT 3
     ) AS top_books_data;

INSERT INTO top_books (genre, book_id, rank)
SELECT 'biography', id, rank
FROM (
         select b.id, ROW_NUMBER() OVER (ORDER BY rating DESC) AS rank from books b
                                                                       join book_genre bg on b.id = bg.book_id
                                                                       join genres g on g.id = bg.genre_id
                                                                       where lower(g.name) like 'biography'
        order by rating desc
         LIMIT 3
     ) AS top_books_data;
	 
	 INSERT INTO top_books (genre, book_id, rank)
SELECT 'crime', id, rank
FROM (
         select b.id, ROW_NUMBER() OVER (ORDER BY rating DESC) AS rank from books b
                                                                       join book_genre bg on b.id = bg.book_id
                                                                       join genres g on g.id = bg.genre_id
                                                                       where lower(g.name) like 'crime'
        order by rating desc
         LIMIT 3
     ) AS top_books_data;
	 
	 INSERT INTO top_books (genre, book_id, rank)
SELECT 'fiction', id, rank
FROM (
         select b.id, ROW_NUMBER() OVER (ORDER BY rating DESC) AS rank from books b
                                                                       join book_genre bg on b.id = bg.book_id
                                                                       join genres g on g.id = bg.genre_id
                                                                       where lower(g.name) like 'fiction'
        order by rating desc
         LIMIT 3
     ) AS top_books_data;
	 
INSERT INTO top_books (genre, book_id, rank)
SELECT 'historical fiction', id, rank
FROM (
         select b.id, ROW_NUMBER() OVER (ORDER BY rating DESC) AS rank from books b
                                                                       join book_genre bg on b.id = bg.book_id
                                                                       join genres g on g.id = bg.genre_id
                                                                       where lower(g.name) like 'historical fiction'
        order by rating desc
         LIMIT 3
     ) AS top_books_data;
	 
	 INSERT INTO top_books (genre, book_id, rank)
SELECT 'self help', id, rank
FROM (
         select b.id, ROW_NUMBER() OVER (ORDER BY rating DESC) AS rank from books b
                                                                       join book_genre bg on b.id = bg.book_id
                                                                       join genres g on g.id = bg.genre_id
                                                                       where lower(g.name) like 'self help'
        order by rating desc
         LIMIT 3
     ) AS top_books_data;
	 
	 INSERT INTO top_books (genre, book_id, rank)
SELECT 'young adult', id, rank
FROM (
         select b.id, ROW_NUMBER() OVER (ORDER BY rating DESC) AS rank from books b
                                                                       join book_genre bg on b.id = bg.book_id
                                                                       join genres g on g.id = bg.genre_id
                                                                       where lower(g.name) like 'young adult'
        order by rating desc
         LIMIT 3
     ) AS top_books_data;
	 
	 
	 
	 
	 
