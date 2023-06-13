//aici vin requesturile pt incarcare de pagini html
const http = require("http");
const fs = require('fs');
const ejs = require('ejs')
const cssRouter = require("./routes/CssRouter")
const PORT = process.env.PORT || 8081;

const PageController = require("./controller/PageController")

const getFileUrl = (url) => {
    const ending = url.substring(url.lastIndexOf("/") + 1);
    return `../views/${ending}.html`
};
const getScriptsUrl = (url) => {
    const ending = url.substring(url.lastIndexOf("/") + 1);
    return `../public/scripts/${ending}`;
};
const getCssUrl = (url) => {
    const ending = url.substring(url.lastIndexOf("/") + 1);
    return `../public/css/${ending}`;
};
const getImagesUrl = (url) => {
    const ending = url.substring(url.lastIndexOf("/") + 1);
    return `../public/images/${ending}`;
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


const customReadEjsFile = (file_path, genre, res) => {
    if (fs.existsSync(file_path)) {
        const template = fs.readFileSync(file_path, "utf8");
        if (!template) {
            sendErrorResponse(res);
            return;
        }
        //make request to server to get genre data, also should make request to get clasament
        http.get(`http://localhost:6969/books/genres/${genre}`, (response) => {
            let data = "";
            response.on("data", (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                const booksData = JSON.parse(data);
                const renderedEJS = ejs.render(template, {books: booksData});
                res.writeHead(200, {"Content-Type": "text/html"});
                res.end(renderedEJS);
            });
        }).on("error", (error) => {
            console.log(error);
            sendErrorResponse(res);
        });
    } else {
        sendErrorResponse(res);
    }
}
const server = http.createServer((req, res) => {
    const url = req.url;
    if (url.startsWith('/books/genres/') && url.indexOf(".") === -1) {
        const genre = url.split('/')[3].toLowerCase();
        customReadEjsFile(`../views/ejs/genres.ejs`, genre, res);
    } else if (url.indexOf(".") === -1) {
        //its an html request{
        res.writeHead(200, {"Content-Type": "text/html"});
        customReadFile(getFileUrl(url), res);
    } else if (url.indexOf(".js") !== -1) {
        res.writeHead(200, {"Content-Type": "text/javascript"});
        customReadFile(getScriptsUrl(url), res);
    } else if (url.indexOf(".css") !== -1) {
        res.writeHead(200, {"Content-Type": "text/css"});
        customReadFile(getCssUrl(url), res);
    } else if (url.indexOf(".png") !== -1) {
        res.writeHead(200, {"Content-Type": "image/png"});
        customReadFile(getImagesUrl(url), res);
    } else if (url.indexOf(".jpg") !== -1) {
        res.writeHead(200, {"Content-Type": "image/jpeg"});
        customReadFile(getImagesUrl(url), res);
    } else if (url.indexOf(".ejs") !== -1) {
        //make request to server to get data
        res.writeHead(200, {"Content-Type": "text/html"});
        customReadEjsFile(`../views/ejs/${url}`, res);
    } else sendErrorResponse(res);

});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
