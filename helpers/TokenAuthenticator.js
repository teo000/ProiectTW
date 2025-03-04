const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const {parse} = require("querystring");

function authenticateToken(req, res, next, ...args) {
    const {url, headers} = req;
    const cookies = cookie.parse(headers.cookie ||'');

    const accessToken = cookies.access_token;
    if (accessToken == null)
        return res.writeHead(401, {'Content-Type': 'text/html'}).end("<h1>Unauthorized</h1>");

    console.log('authenticate Token');

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            if(err.name === "TokenExpiredError")
                return res.writeHead(403, {'Content-Type': 'text/html'}).end("<h1>Expired</h1>");
            console.log(`authenticate Token: ${err}`);
            return res.writeHead(403, {'Content-Type': 'text/html'}).end("<h1>Forbidden</h1>");
        }
        console.log(user.user);
        req.user = user;
        next(req, res, ...args);
    })
}
function authenticateTokenForUser(req, res, next, ...args) {
    const {url, headers} = req;
    const cookies = cookie.parse(headers.cookie ||'');

    const accessToken = cookies.access_token;
    if (accessToken == null)
        return res.writeHead(401, {'Content-Type': 'text/html'}).end("<h1>Unauthorized</h1>");

    console.log('authenticate Token');

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            if(err.name === "TokenExpiredError")
                return res.writeHead(403, {'Content-Type': 'text/html'}).end("<h1>Expired</h1>");
            return res.writeHead(403, {'Content-Type': 'text/html'}).end("<h1>Forbidden</h1>");
        }
        console.log(user.user);
        if(user.user.isadmin === true) {
            return res.writeHead(403, {'Content-Type': 'text/html'}).end("<h1>Forbidden</h1>");
        }
        req.user = user;
        next(req, res, ...args);
    })
}
function authenticateTokenForAdmin(req, res, next, ...args) {
    const {url, headers} = req;
    const cookies = cookie.parse(headers.cookie ||'');

    const accessToken = cookies.access_token;
    if (accessToken == null)
        return res.writeHead(401, {'Content-Type': 'text/html'}).end("<h1>Unauthorized</h1>");

    console.log('authenticate Token for admin');

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            if(err.name === "TokenExpiredError")
                return res.writeHead(403, {'Content-Type': 'text/html'}).end("<h1>Expired</h1>");
            return res.writeHead(403, {'Content-Type': 'text/html'}).end("<h1>Forbidden</h1>");
        }
        console.log(user.user);
        if(user.user.isadmin === false) {
            return res.writeHead(403, {'Content-Type': 'text/html'}).end("<h1>Forbidden</h1>");
        }
        req.user = user;
        next(req, res, ...args);
    })
}

function extractUser(token){
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}


function getUserFromCookie (req,res) {
    const cookies = req.headers.cookie ? parse(req.headers.cookie, '; ') : {};
    if (!cookies.access_token) {
        res.writeHead(401, {"Content-Type": "text/html"});
        res.end('<h1>Unauthorized</h1>');
        return undefined;
    }
    let user = null;
    try {
        user = extractUser(cookies.access_token);
    } catch (error) {
        res.writeHead(403, {"Content-Type": "text/html"});
        res.end('<h1>Forbidden</h1>');
        return undefined;
    }

    if (!user) {
        res.writeHead(401, {"Content-Type": "text/html"});
        res.end('<h1>Unauthorized</h1>');
        return undefined;
    }
    return user.user;
}

module.exports = {
    authenticateToken,
    authenticateTokenForAdmin,
    authenticateTokenForUser,
    extractUser,
    getUserFromCookie
}