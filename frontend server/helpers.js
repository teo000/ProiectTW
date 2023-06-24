const http = require("http");
const fs = require("fs");
const getFileUrl = (url) => {
    const ending = url.substring(url.lastIndexOf("/") + 1);
    console.log(`../views/${ending}.html`);
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

const customReadFile = async (req, res, file_path) => {
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

module.exports = {
    getCssUrl,
    getImagesUrl,
    getFileUrl,
    getScriptsUrl,
    sendErrorResponse,
    customReadFile
}