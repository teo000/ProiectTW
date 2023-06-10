const fs = require('fs');//file server

const loadCssFile = async(req, res) =>{
    if(req.url === '/login.css'){
        res.writeHead(200, {"Content-Type" : "text/css"});
        const fileContents = fs.readFileSync(__dirname+ '\\..\\..\\client\\LogInPage\\login.css',
            "utf8");
        res.end(fileContents);
    }
}
module.exports = {
    loadCssFile
}