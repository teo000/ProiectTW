const {getAllUsers, getUser, createUser, deleteUser, deleteUserByUsername,changeResetPasswordCode} = require('../controllers/userController');
const {getGroup} = require("../controllers/GroupController");
const usernameRegex = /^\/users\/([A-Za-z0-9_-]+)$/;

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
    if (req.url === '/users')
        getAllUsers(req, res);
    else if (req.url.match(usernameRegex)) {
        const username = req.url.split('/')[2];
        getUser(req, res, username);
    } else if(req.url.startsWith('/users/profile')){

    }else if(req.url.startsWith('/changeResetPasswordCode')){
        changeResetPasswordCode(req,res);
    }
    else {
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

const handlePutRequests = (req, res) => {

}
const handleDeleteRequests = (req, res) => {
    if(req.url === '/users'){
        deleteUser(req,res);
    }
    else if(req.url.startsWith('/users/')){
        const username = req.url.split('/')[2].toLowerCase();
        const decodedUsername = decodeURIComponent(username);
        deleteUserByUsername(req, res, decodedUsername);
        console.log(`handleDeleteRequests(): ${res.name}`);
    }
    else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }
}

module.exports = {
    routeRequest
}

