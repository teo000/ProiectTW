const databaseConnection = require('../database/databaseConnection.js');


const addReview = (reviewData) => {
    return new Promise((resolve, reject) => {
        const {username, bookid, date, content, stars, isgeneric} = reviewData;
        databaseConnection.pool.query('Insert into  reviews (userid, bookid, date, content, stars, likes, isgeneric) values ($1, $2, $3, $4, $5, $6,$7) returning *',
            [username, bookid, date, content, stars, 0, isgeneric],
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows[0]);
            });
    });
};

const getUserBookReviews = (bookid, userid) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('select b.title, b.author, u.username, r.date, r.content, r.stars, r.isgeneric, r.id from reviews r join books b on r.bookid = b.id join users u on r.userid = u.id  where bookid = $1 and u.id = $2',
            [bookid, userid],
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows);
            });
    });
}
const deleteReview = (reviewid) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('delete from reviews where id=$1 returning  *',
            [reviewid],
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows);
            });
    });
}
const getBookReviews = (bookid) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('select b.title, b.author, u.username, r.date, r.content, r.stars, r.isgeneric from reviews r join books b on r.bookid = b.id join users u on r.userid = u.id  where bookid = $1',
            [bookid],
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows);
            });
    });
}

const deleteUserBookReview = (bookid, userid) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('delete from reviews where userid=$1 and bookid = $2 returning  *',
            [userid, bookid],
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows);
            });
    });
}

const getAllReviews = () => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('select b.title, b.author, u.username, r.date, r.content, r.stars, r.isgeneric from reviews r join books b on r.bookid = b.id join users u on r.userid = u.id',
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows);
            });
    });
}

const getReviewsMadeByUser = (id) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('select b.title, b.author, u.username, r.date, r.content, r.stars, r.isgeneric from reviews r join books b on r.bookid = b.id join users u on r.userid = u.id where u.id =$1',
            [id],
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows);
            });
    });
}
module.exports = {
    addReview,
    deleteUserBookReview,
    getBookReviews,
    getUserBookReviews,
    deleteReview,
    getAllReviews,
    getReviewsMadeByUser
}