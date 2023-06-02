const {Book} = require('../models/BookModel');
const databaseConnection = require('../database/databaseConnection')

const getAllBooks = ()=>{
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT count(*) FROM books', (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows);
        });
    });
}

const getBookByID = (id) =>{
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT * FROM books where id = $1', [id],(error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows[0]);
        });
    });
}
//@route: GET /books/getBook; json body : {"title": "title"}
const getBookByTitle = (title) =>{
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT * FROM books where title = $1', [title],(error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows[0]);
        });
    });
}

module.exports ={
    getAllBooks,
    getBookByID,
    getBookByTitle
}