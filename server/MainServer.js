const http = require("http");
const PORT = process.env.PORT || 6969;
const fs = require('fs')
const userRouter = require('./routes/UserRoutes');
const bookRouter = require('./routes/BooksRoutes');
const genreRouter = require('./routes/GenreRoutes');
const {createServer} = require("https");
const microServiceRoutes = [
    {path: '/login', method: 'POST'},
    {path: '/logout', method: 'POST'},
    {path: '/token', method: 'POST'}
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
        if (url.startsWith('/users')) {
            userRouter.routeRequest(req, res);
        } else if (url.startsWith('/books')) {
            bookRouter.routeRequest(req, res);
        } else if (url.startsWith('/genres')) {
            genreRouter.routeRequest(req, res);
        }
        else if (url.startsWith('/login') || url.startsWith('/logout') || url.startsWith('/token')) {
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

    req.pipe(request);


    request.on('error', error => {
        console.error(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    });
};
mainServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
