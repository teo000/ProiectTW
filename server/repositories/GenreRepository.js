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


module.exports = {
    getGenre,
    getAllGenres
}
