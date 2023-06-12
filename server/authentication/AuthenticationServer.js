//for login, logout, refresh tokens
const http = require("http");
const PORT = process.env.PORT || 6970;
const AuthenticationController = require('./AuthenticationController')
const {authenticateToken} = require("./AuthenticationController");

const authServer = http.createServer((req,res)=>{
    if(req.url.startsWith('/login')){
        AuthenticationController.login(req,res);
    } else if (req.url.startsWith('/token')){
        AuthenticationController.token(req,res);
    } else if (req.url.startsWith('/logout')){
        AuthenticationController.logout(req,res);
    }
});


authServer.listen(PORT,() => console.log(`Server running on port ${PORT}`));