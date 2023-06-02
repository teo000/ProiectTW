const bookRepository = require('../repositories/BookRepository')
const {Book} = require('../models/BookModel')
const userRepository = require("../repositories/UserRepository");

//@route GET books/getAll
const getAllBooks  = async (req, res) => {
    try {
        const books = await bookRepository.getAllBooks();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(books));
    } catch (error) {
        console.log(error.message);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
};

//@route /books/{id}

const getBookByID = async (req, res, id) =>{
    try {
        const book = await bookRepository.getBookByID(id);
        if (!book) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Book not found!'}));
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(book));
        }
    } catch (error) {
        console.log(error);
    }
}

//@route /books/{title}

const getBookByTitle = async (req, res) =>{
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const title = data.title;


                // Check if the book  exists
                const book = await bookRepository.getBookByTitle(title);
                if (!book) {
                    res.writeHead(404, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Book not found!'}));
                    return;
                }

                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(book));
            } catch (error) {
                console.log(error);
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Internal Server Error'}));
            }
        });
    } catch (error) {
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}
module.exports = {
    getAllBooks,
    getBookByID,
    getBookByTitle
}