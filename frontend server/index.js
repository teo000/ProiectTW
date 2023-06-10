//aici vin requesturile pt incarcare de pagini html
const http = require("http");
const userRouter = require("../server/routes/UserRoutes");
const bookRouter = require("../server/routes/BooksRoutes");
const PORT = process.env.PORT || 8081;

const PageController = require("./controller/PageController")
const server = http.createServer((req, res) => {
    const {url} = req;
   try{
       if(req.url === '/')
           PageController.getLoginPage(req,res);
   }
   catch(error){
       req.writeHead(404, {"Content-type" : "text/html"});
       res.end("<h2>404 Not Found </h2>");
   }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
