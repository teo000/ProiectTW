const {getAllBooks, getBookByID, getBookByTitle, addBook, getGenre,  getTopBooksInGenre,getBooksByCriteria, getGenreCount,getRelatedBooks} = require("../controllers/BookController");
const {addReview, addGenericReview, getBookReviews, getAllReviews, getReviewsMadeByUser} =require("../controllers/ReviewController");
const {getAllBooks, getBookByID, getBookByTitle, addBook, getGenre,  getTopBooksInGenre,getBooksByCriteria, getGenreCount} = require("../controllers/BookController");
const {addReview, addGenericReview, getBookReviews, getAllReviews, getReviewsMadeByUser, deleteReview, getReviewsByUsername} =require("../controllers/ReviewController");
const {addBookToShelf, getUserBooks, removeBookFromShelf} =require("../controllers/ShelvesController");
const bookIdRegex = /^\/books\/[0-9]+$/;
const bookTitleRegex = /^\/books\/[a-zA-Z0-9\s]+$/;
const {authenticateToken} = require('../../helpers/TokenAuthenticator')
const {use} = require("bcrypt/promises");
const {getBookByTitleAndUser} = require("../repositories/BookRepository");

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
        getAllBooks(req,res);
    } else if (req.url.startsWith('/books/genres/top')) {
        const genre = req.url.split('/')[4].toLowerCase();
        const decodedGenre = decodeURIComponent(genre);
        getTopBooksInGenre(req,res,decodedGenre);
    } else if (req.url.startsWith('/books/genres?')) {
        const queryString = req.url.split('?')[1];
        const params = new URLSearchParams(queryString);
        const genre = decodeURIComponent(params.get('genre'));
        const pageSize = params.get('pageSize');
        const pageNumber = params.get('pageNumber');
        // /books/genres?genre=ceva&pageSize=20&pageNumber=2
        getGenre(req,res,genre,pageSize,pageNumber);
    } else if(req.url.startsWith('/books/genres/count')){
        const queryString = req.url.split('?')[1];
        const params = new URLSearchParams(queryString);
        const genre = decodeURIComponent(params.get('genre'));
        getGenreCount(req,res,genre);
    } else if (req.url.match(bookIdRegex)) {
        const id = req.url.split('/')[2];
        getBookByID(req,res,id);
    } else if (req.url.startsWith( '/books/getBook') ){
       getBookByTitle(req,res);
    } else if (req.url.startsWith('/books/mybooks/')){
        getUserBooks(req,res);
    }
    else if(req.url==='/books/reviews/all'){
        getAllReviews(res,res);
    }
    else if (req.url.startsWith('/books/reviews/userid=')){
        const userURI = req.url.split('/')[3];
        const userId = userURI.split('=')[1];
        getReviewsMadeByUser(req,res, userId);
    }
    else if (req.url.startsWith('/books/reviews/username=')){
        const userURI = req.url.split('/')[3];
        const username = userURI.split('=')[1];
        getReviewsByUsername(req,res, username);
    }
    else if (req.url.startsWith('/books/reviews/'))
        getBookReviews(req,res);
    else if(req.url.startsWith('/books/criteria?')){
        getBooksByCriteria(req,res)
    }
    else if(req.url.startsWith('/books/top')){
        getTopBooksInGenre(req,res,"any");
    }
    else if (req.url.startsWith('/books/related/')){
        const data=  req.url.split('/')
        const id = data[3];
        const limit = data[4];
        getRelatedBooks(req,res,id,limit);
    }
    else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }
}

const handlePostRequests = (req, res) => {
    if (req.url === '/books')
        addBook(req, res);
    else if (req.url.startsWith('/books/review/generic'))
        authenticateToken(req,res,addGenericReview);
    else if(req.url.startsWith('/books/review')){
        authenticateToken(req,res,addReview);
    }
    else if (req.url.startsWith('/books/shelf')){
       authenticateToken(req,res,addBookToShelf);
    }

    else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }
}
//books/shelf?bookid=...
const handlePutRequests = (req, res) => {


}
const handleDeleteRequests = (req, res) => {
    if (req.url.startsWith('/books/shelf')) {
        authenticateToken(req,res,removeBookFromShelf);
    }else if (req.url.startsWith('/books/reviews/')){
        const reviewId = req.url.split('/')[3].toLowerCase();
        const decodedReviewId = decodeURIComponent(reviewId);
        deleteReview(req, res, decodedReviewId)
    }
    else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }
}

module.exports = {
    routeRequest
}