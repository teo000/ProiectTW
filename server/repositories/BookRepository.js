const {Book} = require('../models/BookModel');
const databaseConnection = require('../database/databaseConnection')

const getAllBooks = () => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT count(*) FROM books', (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows);
        });
    });
}

const getBookByID = (id) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT b.id, b.title, b.author, b.rating as avgrating, b.description, b.edition, b.publisher, b.year, b.coverimg FROM books b  where id = $1', [id], (error, results) => {
            if (error) {
                reject(error);
            }
            if (results.rowCount > 0) {
                resolve(results.rows[0]);
            }

        });
    });
}

const getBookByName = (name) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT * FROM books where title = $1', [name], (error, results) => {
            if (error) {
                reject(error);
            }
            if (results.rowCount > 0) {
                resolve(results.rows[0]);
            }

        });
    });
}

//@route: GET /books/getBook; json body : {"title": "title"}
const getBookByIdAndUser = (bookid, userid) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT b.id, b.title, b.author, b.rating as avgrating, b.description, b.edition, b.publisher, b.year, b.coverimg ,ub.rating, ub.shelf FROM books b join user_books ub on ub.bookid = b.id where b.id = $1 and ub.userid = $2', [bookid, userid], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows[0]);
        });
    });
}

const getBookByTitle = (title) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT b.id, b.title, b.author, b.rating as avgrating,b.description, b.edition, b.publisher,b.year,b.coverimg FROM books b where LOWER(title) = $1', [title], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows[0]);
        });
    });
}
const getBooksByEdition = (edition, limit, offset) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT b.id, b.title, b.author, b.rating as avgrating,b.description, b.edition, b.publisher,b.year,b.coverimg FROM books b where LOWER(edition) = $1 order by b.id limit $2 offset $3', [edition, limit, offset], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows);
        });
    });
}
const getBooksByYear = (year, limit, offset) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT b.id, b.title, b.author, b.rating as avgrating,b.description, b.edition, b.publisher,b.year,b.coverimg FROM books b where year = $1 order by b.id limit $2 offset  $3', [year, limit, offset], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows);
        });
    });
}

const getBooksByAuthor = (author, limit, offset) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT b.id, b.title, b.author, b.rating as avgrating,b.description, b.edition, b.publisher,b.year,b.coverimg FROM books b where lower(b.author) = $1 order by b.id limit $2 offset  $3', [author, limit, offset], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows);
        });
    });
}
const getBooksByPublisher = (publisher, limit, offset) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT b.id, b.title, b.author, b.rating as avgrating,b.description, b.edition, b.publisher,b.year,b.coverimg FROM books b where lower(b.publisher) = $1 order by b.id limit $2 offset  $3', [publisher, limit, offset], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows);
        });
    });
}

const getBooksBySearchInput = (searchInput, limit, offset) => {
    const searchInputFormated = `%${searchInput}%`;
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query(`SELECT b.id,
                                              b.title,
                                              b.author,
                                              b.rating as avgrating,
                                              b.description,
                                              b.edition,
                                              b.publisher,
                                              b.year,
                                              b.coverimg
                                       FROM books b
                                       where lower(b.author) like $1
                                          or lower(b.title) like $1
                                       order by b.id
                                           limit $2
                                       offset $3;
        `, [searchInputFormated, limit, offset], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows);
        });
    });
}
const getBooksByGenre = async (genre, limit, offset) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('select  b.id, b.title,b.author, b.rating, b.description, b.coverimg from books b join book_genre bg on b.id = bg.book_id join genres g on bg.genre_id = g.id where LOWER(g.name)= $1 order by b.id limit $2 offset $3',
            [genre, limit, offset], (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows);
            });
    });
}

const getTopBooksInGenre = async (genre) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query(`select title, rating, rank, genre, id
                                       from top_books
                                                join books b on top_books.book_id = b.id
                                       where genre like $1
                                       order by rating desc`, [genre], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows);
        });
    });
}


const getTopBooksInGenreOverall = async (genre) => {
    if(genre === "any")
        return new Promise((resolve, reject) => {
            databaseConnection.pool.query(`select b.id,
                                                  b.title,
                                                  b.author,
                                                  b.rating,
                                                  b.description,
                                                  b.edition,
                                                  b.publisher,
                                                  b.year,
                                                  b.coverimg
                                           from books b
                                           order by rating desc limit 3`, (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows);
            });
        });
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query(`select b.id,
                                              b.title,
                                              b.author,
                                              b.rating,
                                              b.description,
                                              b.edition,
                                              b.publisher,
                                              b.year,
                                              b.coverimg,
                                              g.name
                                       from books b
                                                join book_genre bg on b.id = bg.book_id
                                                join genres g on bg.genre_id = g.id
                                       where LOWER(g.name) = $1
                                       order by rating desc limit 3`, [genre], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows);
        });
    });
}

const isTopChanged = async (genre, first, second, third) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query(`SELECT COUNT(*) AS count_diff
                                       FROM (SELECT book_id, rank
                                             FROM top_books
                                             WHERE lower(genre) = $1
                                             ORDER BY rank LIMIT 3) AS top_books_table
                                                LEFT JOIN (SELECT $2::integer AS book_id, 1 AS rank
                                                           UNION ALL
                                                           SELECT $3::integer  AS book_id, 2 AS rank
                                                           UNION ALL
                                                           SELECT $4::integer  AS book_id, 3 AS rank) AS current_top_books
                                                          ON top_books_table.book_id = current_top_books.book_id AND
                                                             top_books_table.rank = current_top_books.rank
                                       WHERE current_top_books.book_id IS NULL`, [genre, first, second, third], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results);
        })
    });
}
const changeTop = async (genre, first, second, third) => {
    await deleteTop(genre);
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query(`insert into top_books
                                       values ($1, $2, 1),
                                              ($1, $3, 2),
                                              ($1, $4, 3)`, [genre, first, second, third], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows);
        })
    });
}

const deleteTop = (genre) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query(`delete
                                       from top_books
                                       where lower(genre) like $1`, [genre], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows[0]);
        })
    });
}
const addBook = async (bookData) => {
    return new Promise((resolve, reject) => {
        const {title, author, rating, description, edition, publisher, year, numberOfRatings, coverImg} = bookData;
        databaseConnection.pool.query('INSERT INTO books (title, author,rating,description,edition, publisher, year,numberOfRatings,coverImg) VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9) RETURNING *',
            [title, author, rating, description, edition, publisher, year, numberOfRatings, coverImg], (error, results) => {
                if (error) {
                    reject(error);
                }
                console.log(results)
                resolve(results.rows[0]);
            });
    });
}
const getGenreCount = (genre) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('select count(*) from books b join book_genre bg on b.id = bg.book_id join genres g on bg.genre_id = g.id where lower(g.name) like $1 group by g.id;',
            [genre], (error, results) => {
                if (error) {
                    reject(error);
                }
                console.log(results)
                resolve(results.rows[0]);
            });
    });
}

const getRelatedBooks = (id, limit, information) => {
    if (information === undefined)
        return new Promise((resolve, reject) => {
            databaseConnection.pool.query(`select id, title, author, coverimg
                                           from books
                                           where id in (select related_book_id
                                                        from get_related_books($1)
                                                        order by match_type) limit $2`,
                [id, limit,], (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    console.log(results)
                    resolve(results.rows);
                });
        });

    return new Promise((resolve, reject) => {
        databaseConnection.pool.query(`select id, title, author, coverimg,rating as avgrating, description
                                       from books
                                       where id in (select related_book_id
                                                    from get_related_books($1)
                                                    order by match_type) limit $2`,
            [id, limit,], (error, results) => {
                if (error) {
                    reject(error);
                }
                console.log(results)
                resolve(results.rows);
            });
    });

}

const deleteBook = (bookId) => {
    console.log(`deleteBook: ${bookId}`);
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('delete from books where id=$1 returning  *',
            [bookId],
            (error, results) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                console.log(results);
                resolve(results.rows[0]);
            });
    });
}

const updateCoverImage = (bookId, coverimg) => {
    console.log(`updateCoverImage: ${bookId}, ${coverimg}`);
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('update books set coverimg = $1 where id=$2 returning  *',
            [coverimg, bookId],
            (error, results) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                console.log(results);
                resolve(results.rows[0]);
            });
    });
}
const updateBookAuthor = (bookId, author) => {
    console.log(`updateBookAuthor: ${bookId}, ${author}`);
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('update books set author = $1 where id=$2 returning  *',
            [author, bookId],
            (error, results) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                console.log(results.rows);
                resolve(results.rows[0]);
            });
    });
}

const updateBookDescription = (bookId, description) => {
    console.log(`updateBookDescription: ${bookId}, ${description}`);
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('update books set description = $1 where id=$2 returning  *',
            [description, bookId],
            (error, results) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                console.log(results.rows);
                resolve(results.rows[0]);
            });
    });
}

const updateBookPublisher = (bookId, publisher) => {
    console.log(`updateBookDescription: ${bookId}, ${publisher}`);
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('update books set publisher = $1 where id=$2 returning  *',
            [publisher, bookId],
            (error, results) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                console.log(results.rows);
                resolve(results.rows[0]);
            });
    });
}

const updateBookEdition = (bookId, edition) => {
    console.log(`updateBookDescription: ${bookId}, ${edition}`);
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('update books set edition = $1 where id=$2 returning  *',
            [edition, bookId],
            (error, results) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                console.log(results.rows);
                resolve(results.rows[0]);
            });
    });
}
const updateBookYear = (bookId, year) => {
    console.log(`updateBookDescription: ${bookId}, ${year}`);
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('update books set year = $1 where id=$2 returning  *',
            [year, bookId],
            (error, results) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                console.log(results.rows);
                resolve(results.rows[0]);
            });
    });
}

const deleteBookGenre = (bookId, genreId) => {
    console.log(`updateBookDescription: ${bookId}, ${genreId}`);
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('delete from book_genre where book_id=$1 and genre_id = $2 returning  *',
            [bookId, genreId],
            (error, results) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                console.log(results.rows);
                resolve(results.rows[0]);
            });
    });
}

const addBookGenre = (bookId, genreId) => {
    console.log(`updateBookDescription: ${bookId}, ${genreId}`);
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('insert into book_genre (book_id, genre_id) values ($1, $2) returning  *',
            [bookId, genreId],
            (error, results) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                console.log(results.rows);
                resolve(results.rows[0]);
            });
    });
}

module.exports = {
    getAllBooks,
    getBookByID,
    getBookByIdAndUser,
    addBook,
    getBooksByGenre,
    getTopBooksInGenre,
    getBookByTitle,
    getGenreCount,
    getBooksByEdition,
    getBooksByYear,
    getBooksByPublisher,
    getBooksByAuthor,
    getBooksBySearchInput,
    getTopBooksInGenreOverall,
    isTopChanged,
    changeTop,
    getBookByName,
    getRelatedBooks,
    deleteBook,
    updateCoverImage,
    updateBookAuthor,
    updateBookDescription,
    deleteBookGenre,
    addBookGenre,
    updateBookPublisher,
    updateBookEdition,
    updateBookYear
}