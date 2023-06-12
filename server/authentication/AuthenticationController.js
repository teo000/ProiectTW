//login & authenticate token functions
const userRepository = require("../repositories/UserRepository");
const {User} = require("../models/UserModel");
const {checkPasswordValidity} = require("../models/AuthenticationModel");
const jwt = require("jsonwebtoken");

let refreshTokens = [];
//@route /login
const login = async (req, res) => {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const userData = JSON.parse(body);

                // Validate the required fields (username, password)
                if (!userData.username || !userData.password) {
                    res.writeHead(400, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Username and password are required'}));
                    return;
                }

                // Check if the username is valid
                const existingUser = await userRepository.getUser(userData.username);
                if (!existingUser) {
                    res.writeHead(401, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Username incorrect!'}));
                    return;
                }
                const userObject = new User(existingUser.ID, existingUser.username, existingUser.email, existingUser.passwordhash, existingUser.salt);

                //check if the password is valid
                const isValid = await checkPasswordValidity(userObject, userData.password);
                if (isValid) {
                    //create json webtoken
                    const accessToken = generateAccessToken(userObject);
                    const refreshToken = jwt.sign({userObject}, `${process.env.REFRESH_TOKEN_SECRET}`);
                    refreshTokens.push(refreshToken);
                    res.writeHead(201, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({accessToken: accessToken, refreshToken: refreshToken}));
                    return;
                }
                res.writeHead(401, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Incorrect Password!'}));

            } catch (error) {
                console.log(error);
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Internal Server Error'}));
            }
        });
    } catch (error) {
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

const token = async (req, res) => {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const token = data.token;
                if (token == null) {
                    console.log(data);
                    console.log(token);
                    res.writeHead(401, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Unauthorized'}));
                    return;
                }
                if (!refreshTokens.includes(token)) {
                    console.log(refreshTokens);

                    console.log(token);
                    res.writeHead(403, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Forbidden'}));
                    return;
                }
                jwt.verify(token, `${process.env.REFRESH_TOKEN_SECRET}`, (err, user) => {
                    if (err) {

                        res.writeHead(403, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({error: 'Forbidden'}));
                        return;
                    }
                    const accessToken = generateAccessToken(user);
                    refreshTokens.push(accessToken);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({accessToken: accessToken}));
                })
            } catch (error) {
                console.log(error);
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Internal Server Error'}));
            }
        });
    } catch (error) {
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}


function authenticateToken(req, res, next, ...args) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.writeHead(401, {'Content-Type': 'text/html'}).end("<h1>Unauthorized</h1>");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.writeHead(403, {'Content-Type': 'text/html'}).end("<h1>Forbidden</h1>");
        }
        req.user = user;
        next(req, res, ...args);
    })
}

function generateAccessToken(user) {
    return jwt.sign({user}, `${process.env.ACCESS_TOKEN_SECRET}`, {expiresIn: '1h'});
}

const logout = async (req,res) => {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const token = data.token;
                if (token == null) {
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Internal Server Error'}));
                    return;
                }
                if(refreshTokens.includes(token)){
                    const index = refreshTokens.indexOf(token);
                    refreshTokens.splice(index,1);
                    res.writeHead(204, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Succeeded'}));
                    return;
                }
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Internal Server Error'}));
            } catch (error) {
                console.log(error);
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Internal Server Error'}));
            }
        });
    } catch (error) {
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }}
module.exports = {
    login,
    authenticateToken,
    token,
    logout
}