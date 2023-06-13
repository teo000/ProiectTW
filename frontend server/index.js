//aici vin requesturile pt incarcare de pagini html
const http = require("http");
const fs = require('fs');
const cssRouter = require("./routes/CssRouter")
const PORT = process.env.PORT || 8081;

const PageController = require("./controller/PageController")

const getFileUrl = (url) => {
    return `../views${url}.html`
};

const sendErrorResponse = res => {
    res.writeHead(404, {
        "Content-Type": "text/html"
    });
    res.write("<h1>File Not Found!</h1>");
    res.end();
};

const customReadFile = (file_path, res) => {
    if (fs.existsSync(file_path)) {
        fs.readFile(file_path, (error, data) => {
            if (error) {
                console.log(error);
                sendErrorResponse(res);
                return;
            }
            res.write(data);
            res.end();
        });
    } else {
        sendErrorResponse(res);
    }
};

const server = http.createServer((req, res) => {
    const url = req.url;
    if (url.indexOf(".") === -1) {
        //its an html request{
        res.writeHead(200, {"Content-Type": "text/html"});
        customReadFile(getFileUrl(url), res);
    } else if (url.indexOf(".js") !== -1) {
        res.writeHead(200, {"Content-Type": "text/javascript"});
        customReadFile(`..${url}`, res);
    } else if (url.indexOf(".css") !== -1) {
        res.writeHead(200, {"Content-Type": "text/css"});
        customReadFile(`..${url}`, res);
    } else if (url.indexOf(".png") !== -1) {
        res.writeHead(200, {"Content-Type": "image/png"});
        customReadFile(`..${url}`, res);
    } else if (url.indexOf(".jpg") !== -1) {
        res.writeHead(200, {"Content-Type": "image/jpg"});
        customReadFile(`..${url}`, res);
    } else if (url.indexOf(".ejs") !== -1) {
        //make request to server to get data
        res.writeHead(200, {"Content-Type": "image/jpg"});
        customReadFile(`../partials/${url}`, res);
    } else sendErrorResponse(res);

});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
