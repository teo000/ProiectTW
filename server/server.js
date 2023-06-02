const http = require("http");
const {getAllUsers, getUser, createUser, login} = require('./controllers/userController');
const {getAllBooks, getBookByID, getBookByTitle} = require("./controllers/BookController");
const usernameRegex = /^\/users\/([A-Za-z0-9_-]+)$/;
const bookIdRegex = /^\/books\/[0-9]+$/;
const bookTitleRegex = /^\/books\/[a-zA-Z0-9\s]+$/;
const PORT = process.env.PORT || 6969;

const server = http.createServer((req, res) => {
    if (req.method === 'GET')
        handleGetRequests(req, res);
    else if (req.method === 'POST')
        handlePostRequests(req, res);
    else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }
});

const handleGetRequests = (req, res) => {
    if (req.url === '/users/getAll')
        getAllUsers(req, res);
    else if (req.url === '/users/login') {
        login(req, res);
    } else if (req.url.match(usernameRegex)) {
        const username = req.url.split('/')[2];
        getUser(req, res, username);
    } else if (req.url === '/books/getAll') {
        getAllBooks(req, res);
    } else if(req.url.match(bookIdRegex)) {
        const id = req.url.split('/')[2];
        getBookByID(req,res,id);
    }
    else if (req.url === '/books/getBook'){
        getBookByTitle(req, res);
    }
    else
    {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }

}

const handlePostRequests = (req, res) => {
    if (req.url === '/users/user')
        createUser(req, res);
    else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }

}
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
