const {getMyGroups} = require("../controllers/GroupController");

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
    if (req.url.startsWith('/groups/mygroups')) {
        console.log("aici");
        getMyGroups(req, res);
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