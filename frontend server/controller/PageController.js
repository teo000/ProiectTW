const fs = require('fs');
const https = require("https");
//file server
const directory = __dirname;
const loginHtml = '\\..\\..\\client\\LogInPage\\login.html';

const getHTMLURL = (url) => {
    return `/../..//client//LogInPage//${url}.html`
};
const getLoginPage = async (req, res) => {
    //ceva request sa iau pagina de login
    const url = getHTMLURL(req.url);
    res.writeHead(200, {"Content-Type": "text/html"});
    fs.readFile(url, (error, data)=> {
        if (error) {
            res.writeHead(404);
            res.write("<h1>File not Found</h1>");
        }
        else{
            res.writeHead(200, {"Content-Type":"text/html"});
            res.write(data);
        }
        res.end();
    });

}

module.exports = {
    getLoginPage
}
