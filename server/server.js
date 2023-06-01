const http = require("http");
const {getAllUsers, getUser} = require('./controllers/userController');
const usernameRegex = /^\/users\/([A-Za-z0-9_-]+)$/;

const PORT = process.env.PORT || 6969;

const server = http.createServer((req, res) => {
    if (req.url === '/users/getAll' && req.method === 'GET') {
        getAllUsers(req, res);
    } else if (req.url.match(usernameRegex) && req.method === 'GET') {
        const username = req.url.split('/')[2];
       getUser(req,res,username);
    } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
