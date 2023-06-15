const databaseConnection = require('../database/databaseConnection.js');


const addBookToShelf = (data) => {
    return new Promise((resolve, reject) => {
        const {bookid, userid, rating, shelf} = data;
        databaseConnection.pool.query('insert into user_books(bookid, userid, rating, shelf) values ($1,$2,$3,$4) returning  *',
            [bookid, userid, rating, shelf],
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows[0]);
            });
    });
};

const getBookFromUserShelf = (data) => {
    return new Promise((resolve, reject) => {
        const {bookid, userid, rating, shelf} = data;
        databaseConnection.pool.query('select * from user_books where bookid = $1 and userid = $2',
            [bookid, userid],
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows[0]);
            });
    });
}

const updateBook = (data) => {
    return new Promise((resolve, reject) => {
        const {bookid, userid, rating, shelf} = data;
        databaseConnection.pool.query('update user_books set rating = $3 , shelf = $4 where bookid = $1 and userid = $2 returning  *',
            [bookid, userid, rating, shelf],
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows[0]);
            });
    });
}

const deleteBookFromShelf = (data) => {
    return new Promise((resolve, reject) => {
        const {bookid, userid, rating, shelf} = data;
        databaseConnection.pool.query('select * from user_books where bookid = $1 and userid = $2',
            [bookid, userid],
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows[0]);
            });
    });
}

const getUserBooks = (id, shelf) => {
    if (shelf === 'all')
        return new Promise((resolve, reject) => {
            databaseConnection.pool.query('select users.username, b.coverimg,b.title,b.author, b.rating as avgrating,ub.rating, ub.shelf from users join user_books ub on users.id = ub.userid join books b on ub.bookid = b.id where users.id = $1',
                [id],
                (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(results.rows);
                });
        });

    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('select users.username, b.coverimg,b.title,b.author, b.rating as avgrating,ub.rating, ub.shelf from users join user_books ub on users.id = ub.userid join books b on ub.bookid = b.id where users.id = $1 and ub.shelf = $2',
            [id,shelf],
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows);
            });
    });

}
module.exports = {
    addBookToShelf,
    getBookFromUserShelf,
    updateBook,
    getUserBooks
}