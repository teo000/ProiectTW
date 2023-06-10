const {getAllBooks, getBookByID, getBookByTitle, addBook} = require("../controllers/BookController");
const bookIdRegex = /^\/books\/[0-9]+$/;
const bookTitleRegex = /^\/books\/[a-zA-Z0-9\s]+$/;

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
        getAllBooks(req, res);
    } else if (req.url.match(bookIdRegex)) {
        const id = req.url.split('/')[2];
        getBookByID(req, res, id);
    } else if (req.url === '/books/getBook') {
        getBookByTitle(req, res);
    } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }
}

const handlePostRequests = (req, res) => {
    if (req.url === '/books')
        addBook(req,res);
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