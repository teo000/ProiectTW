const {getGenreForBook} = require("../controllers/GenreController");
const {authenticateToken} = require('../../helpers/TokenAuthenticator')

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
    if (req.url.startsWith('/genres/')) {
        const title = req.url.split('/')[2];
        const decodedTitle = decodeURIComponent(title);
        //getGenreForBook(req,res,decodedTitle)
        authenticateToken(req, res, getGenreForBook, decodedTitle);
    }else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }
}

const handlePostRequests = (req, res) => {

}

const handlePutRequests = (req, res) => {

}
const handleDeleteRequests = (req, res) => {

}

module.exports = {
    routeRequest
}