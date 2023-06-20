const {getMyGroups, getGroup, joinGroupByInviteCode, createGroup, setCurrentBook, getGroupMembers} = require("../controllers/GroupController");
const {getTopBooksInGenre} = require("../controllers/BookController");

const routeRequest = async (req, res) => {
    const {url, method} = req;
    console.log(`groupRoutes: ${url}, ${method}`);
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
    const {url} = req;
    console.log(`handleGetRequests: ${url}`);
    if (req.url === '/groups/mygroups') {
        console.log("aici");
        getMyGroups(req, res);
    }else if(req.url.startsWith('/groups/group/')){
        const group = req.url.split('/')[3].toLowerCase();
        const decodedGroup = decodeURIComponent(group);
        getGroup(req, res, decodedGroup);
        console.log(`handleGetRequests(): ${res.name}`);
    }
    else if(req.url.startsWith( '/groups/members')) {
        const group = req.url.split('/')[3].toLowerCase();
        const decodedGroup = decodeURIComponent(group);
        getGroupMembers(req, res, decodedGroup);
        console.log('gasit membri');
    }
    else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }
}

const handlePostRequests = (req, res) => {
    const {url} = req;
    console.log(`handlePostRequests: ${url}`);
    if (req.url === '/groups/join') {
        joinGroupByInviteCode(req, res);
    }
    else if (req.url === '/groups/create') {
        createGroup(req, res);
    }
    else if(req.url.startsWith('/groups/currentbook/')){
        if(req.url === '/groups/currentbook/set'){
            setCurrentBook(req, res);
        }
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