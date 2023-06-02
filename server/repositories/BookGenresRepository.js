const databaseConnection = require('../database/databaseConnection.js');

const addAssociation = async (bookID, genreID)=>{
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('INSERT INTO book_genre (book_id, genre_id) VALUES ($1, $2) RETURNING *',
            [bookID, genreID], (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows[0]);
            });
    });
}

module.exports = {
    addAssociation
}