//for login, logout, refresh tokens
const http = require("http");
const PORT = process.env.PORT || 6970;
const AuthenticationController = require('./AuthenticationController')

const authServer = http.createServer((req, res) => {
    console.log(`auth request: ${req}`)
    if (req.url.startsWith('/login')) {
        AuthenticationController.login(req, res);
    } else if (req.url.startsWith('/token')) {
        AuthenticationController.token(req, res);
    } else if (req.url.startsWith('/logout')) {
        AuthenticationController.logout(req, res);
    } else if (req.url.startsWith('/signup')) {
        AuthenticationController.signup(req, res);
    } else if (req.url === '/adminsignup')
        AuthenticationController.adminsignup(req, res);
    else if (req.url === '/resetPassword')
        AuthenticationController.resetPassword(req, res);
    else if (req.url === '/requestresetpassword')
        AuthenticationController.requestresetPassword(req,res);
    else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Endpoint not found'}));
    }


});


authServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));