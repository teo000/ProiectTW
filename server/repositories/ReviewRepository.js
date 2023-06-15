const databaseConnection = require('../database/databaseConnection.js');


const addReview = (reviewData) => {
    return new Promise((resolve, reject) => {
        const {username, bookid, date, content, stars} = reviewData;
        databaseConnection.pool.query('Insert into  reviews (userid, bookid, date, content, stars, likes) values ($1, $2, $3, $4, $5, $6) returning *',
            [username, bookid, date, content, stars, 0],
            (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows[0]);
        });
    });
};

module.exports = {
    addReview
}