const http = require("http");
const PORT = process.env.PORT || 6969;

const userRouter = require('./routes/UserRoutes');
const bookRouter = require('./routes/BooksRoutes');

const server = http.createServer((req, res) => {
   const {url} = req;
   if(url.startsWith('/users')){
       userRouter.routeRequest(req,res);
   }
   else if (url.startsWith('/books')){
       bookRouter.routeRequest(req,res);
   }
    else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
