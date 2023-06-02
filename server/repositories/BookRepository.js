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


//

const addBook = async (bookData) => {
    return new Promise((resolve, reject) => {
        const { title, author,rating,description,edition,publisher,year, numberOfRatings,coverImg } = bookData;
        databaseConnection.pool.query('INSERT INTO books (title, author,rating,description,edition, publisher, year,numberOfRatings,coverImg) VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9) RETURNING *',
            [ title, author,rating,description,edition,publisher,year, numberOfRatings,coverImg], (error, results) => {
                if (error) {
                    reject(error);
                }
                console.log(results)
                resolve(results.rows[0]);
            });
    });
}

module.exports ={
    getAllBooks,
    getBookByID,
    getBookByTitle,
    addBook
}