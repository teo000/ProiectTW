const cookie = require("cookie");
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next, ...args) {
    const {url, headers} = req;
    const cookies = cookie.parse(headers.cookie ||'');

    const accessToken = cookies.access_token;
    if (accessToken == null)
        return res.writeHead(401, {'Content-Type': 'text/html'}).end("<h1>Unauthorized</h1>");

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            if(err.name === "TokenExpiredError")
                  return res.writeHead(403, {'Content-Type': 'text/html'}).end("<h1>Expired</h1>");
            return res.writeHead(403, {'Content-Type': 'text/html'}).end("<h1>Forbidden</h1>");
        }
        req.user = user;
        next(req, res, ...args);
    })
}

function extractUser(token){
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

module.exports = {
    authenticateToken,
    extractUser
}