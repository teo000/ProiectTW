var fs = require('fs');//file server
const directory = __dirname;
const loginHtml = '\\..\\..\\client\\LogInPage\\login.html';
const getLoginPage = async (req, res) =>{
    //ceva request sa iau pagina de login
     res.writeHead(200, {"Content-Type" : "text/html"});
     const loginPageHtmlContent = fs.readFileSync(
         directory + loginHtml,
         "utf-8"
     );
     res.end(loginPageHtmlContent);
}

module.exports = {
    getLoginPage
}
