const http = require("http");
const PORT = process.env.PORT || 6969;
const fs = require('fs')
const userRouter = require('./routes/UserRoutes');
const bookRouter = require('./routes/BooksRoutes');
const genreRouter = require('./routes/GenreRoutes');
const groupRouter = require('./routes/GroupRoutes');
const statisticsRouter = require('./routes/StatisticsRoutes');
const {createServer} = require("https");
const microServiceRoutes = [
    {path: '/login', method: 'POST'},
    {path: '/logout', method: 'POST'},
    {path: '/token', method: 'POST'},
    {path: '/signup', method: 'POST'},
    {path: '/resetPassword', method: 'POST' },
    {path: '/adminsignup', method: 'POST'},
    {path: '/adminlogin', method: 'POST'},
    {path: '/requestresetpassword', method: 'POST'}

];

const authenticationMicroservice = {
    hostname: 'localhost',
    port: 6970
};

const mainServer = http.createServer(
    (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }
        const {url} = req;

        console.log(`back request: ${url}`);
        if (url.startsWith('/users') || url.startsWith('/changeResetPasswordCode')) {
            userRouter.routeRequest(req, res);
        } else if (url.startsWith('/books')) {
            bookRouter.routeRequest(req, res);
        } else if (url.startsWith('/genres')) {
            genreRouter.routeRequest(req, res);
        } else if (url.startsWith('/groups')){
            console.log(`starts with groups ${url}`);
            groupRouter.routeRequest(req, res);
            console.log(`main server`);
        } else if(req.url.startsWith('/statistics')){
            statisticsRouter.handleRequests(req, res);
        } else if (url.startsWith('/login') || url.startsWith('/logout') || url.startsWith('/token') || url.startsWith('/signup')
            || url.startsWith('/adminsignup') || url.startsWith('/adminlogin') || url.startsWith('/requestresetpassword') || url.startsWith('/resetPassword') ) {
            handleAuthentication(req, res);
        } else {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Endpoint not found'}));
        }
    });

const handleAuthentication = async (req, res) => {
    const microServiceRoute = microServiceRoutes.find(route => req.url.startsWith(route.path));
    const {path, method} = microServiceRoute;
    const microServiceOptions = {
        ...authenticationMicroservice,
        path,
        method,
        headers: {}
    };
    if (req.headers.cookie)
        microServiceOptions.headers.Cookie = req.headers.cookie;


    let request = http.request(microServiceOptions, response => {
        response.on('data', chunk => {
            res.write(chunk);
        });

        response.on('end', () => {
            res.end();
        });

        res.writeHead(response.statusCode, response.headers);
    });

    if(request.method === 'POST')
     req.pipe(request);


    request.on('error', error => {
        console.error(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    });
};
mainServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
