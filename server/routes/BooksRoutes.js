const {getAllBooks, getBookByID, getBookByTitle, addBook, getGenre,  getTopBooksInGenre} = require("../controllers/BookController");
const {addReview} =require("../controllers/ReviewController");
const {addBookToShelf, getUserBooks} =require("../controllers/ShelvesController");
const bookIdRegex = /^\/books\/[0-9]+$/;
const bookTitleRegex = /^\/books\/[a-zA-Z0-9\s]+$/;
const {authenticateToken} = require('../../helpers/TokenAuthenticator')
const {use} = require("bcrypt/promises");

const routeRequest = async (req, res) => {
    if (req.method === 'GET')
        handleGetRequests(req, res);
    else if (req.method === 'POST')
        handlePostRequests(req, res);
    else if (req.method === 'PUT')
        handlePutRequests(req, res);
    else if (req.method === 'DELETE')
        handleDeleteRequests(req, res);
}

const handleGetRequests = (req, res) => {
    if (req.url === '/books/getAll') {
        authenticateToken(req, res, getAllBooks)
    } else if (req.url.startsWith('/books/genres/top')) {
        const genre = req.url.split('/')[4].toLowerCase();
        const decodedGenre = decodeURIComponent(genre);
        getTopBooksInGenre(req, res, decodedGenre);
    } else if (req.url.startsWith('/books/genres/')) {
        const genre = req.url.split('/')[3].toLowerCase();
        const decodedGenre = decodeURIComponent(genre);
        getGenre(req, res, decodedGenre);
    } else if (req.url.match(bookIdRegex)) {
        const id = req.url.split('/')[2];
        authenticateToken(req, res, getBookByID, id)
    } else if (req.url.startsWith( '/books/getBook') ){
       getBookByTitle(req,res);
    } else if (req.url.startsWith('/books/mybooks/')){

        getUserBooks(req,res);
    }
    else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }
}

const handlePostRequests = (req, res) => {
    if (req.url === '/books')
        addBook(req, res);
    else if(req.url.startsWith('/books/review')){
        addReview(req,res);
    }
    else if (req.url.startsWith('/books/shelf')){
        addBookToShelf(req,res);
    }
    else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }
}

const handlePutRequests = (req, res) => {

}
const handleDeleteRequests = (req, res) => {

}

module.exports = {
    routeRequest
}