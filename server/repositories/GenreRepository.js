const databaseConnection = require('../database/databaseConnection.js');

//@desc : returns all genres in the database
const getAllGenres = () => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT * FROM genres', (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows);
        });
    });
};

//@desc : returns a genre by its name
const getGenre =async (name) =>{
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT * FROM genres where name = $1', [name[0]],(error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows[0]);
        });
    });
}


const getGenresForBook = async(id) =>{
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('select distinct g.name from books b  join book_genre bg on b.id = bg.book_id join genres g on bg.genre_id = g.id where b.id = $1', [id],(error, results) => {
            if (error) {
                reject(error);
            }
            if(results.rowCount > 0)
                resolve(results.rows);

        });
    });
}

const addGenre = (name) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('INSERT INTO genres (name) VALUES ($1)', [name], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows[0]);
        });
    });
};

module.exports = {
    getGenre,
    getAllGenres,
    getGenresForBook,
    addGenre
}
