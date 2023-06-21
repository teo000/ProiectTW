CREATE OR REPLACE FUNCTION get_related_books(pbook_id INT)
    RETURNS TABLE (related_book_id INT, match_type INT) AS
$$
DECLARE
    author_value TEXT;
BEGIN
    -- Retrieve the author value once and store it in a variable
    SELECT author INTO author_value
    FROM books
    WHERE id = pbook_id;

    -- Step 1: Books by the same author
    RETURN QUERY
        SELECT b.id, 1 AS match_type
        FROM books b
        WHERE b.author = author_value
          AND b.id <> pbook_id
        LIMIT 4;

    -- Step 2: Books with the same genres
    RETURN QUERY
        SELECT b.id, 2 AS match_type
        FROM books b
                 INNER JOIN book_genre bg ON b.id = bg.book_id
                 INNER JOIN genres g ON bg.genre_id = g.id
        WHERE b.id <> pbook_id
          AND EXISTS (
            SELECT 1
            FROM book_genre bg2
            WHERE bg2.book_id = pbook_id
              AND bg2.genre_id = bg.genre_id
        )
        LIMIT 4;
END;
$$
    LANGUAGE plpgsql;
