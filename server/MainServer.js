const http = require("http");
const PORT = process.env.PORT || 6969;

const userRouter = require('./routes/UserRoutes');
const bookRouter = require('./routes/BooksRoutes');
const loginMicroserviceOptions = {
    hostname: 'localhost',
    port: 6970,
    path: '/login',
    method: 'POST',
};


const mainServer = http.createServer((req, res) => {
   const {url} = req;
   if(url.startsWith('/users')){
       userRouter.routeRequest(req,res);
   }
   else if (url.startsWith('/books')){
       bookRouter.routeRequest(req,res);
   } else if (url.startsWith('/login')){
        handleLogin(req,res);
   }
    else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }
});

const handleLogin = async (req, res) =>{
    const loginRequest = http.request(loginMicroserviceOptions, loginResponse => {
        loginResponse.on('data', chunk => {
            res.write(chunk);
        });

        loginResponse.on('end', () => {
            res.end();
        });

        res.writeHead(loginResponse.statusCode, loginResponse.headers);
    });

    req.on('data', chunk => {
        loginRequest.write(chunk);
    });

    req.on('end', () => {
        loginRequest.end();
    });

    loginRequest.on('error', error => {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    });
};
mainServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
