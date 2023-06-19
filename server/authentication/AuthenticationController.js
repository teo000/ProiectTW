//login & authenticate token functions
const userRepository = require("../repositories/UserRepository");
const {User} = require("../models/UserModel");
const {checkPasswordValidity, AuthenticationModel} = require("../models/AuthenticationModel");
const jwt = require("jsonwebtoken");
const cookie = require('cookie');

let refreshTokens = [];
let bannedAccessTokens = [];
//@route /login
const login = async (req, res) => {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        console.log('logam om');

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
                const userObject = new User(existingUser.id, existingUser.username, existingUser.email, existingUser.passwordhash, existingUser.salt);

                //check if the password is valid
                const isValid = await checkPasswordValidity(userObject, userData.password);
                if (isValid) {

                    //create json webtoken
                    const accessToken = generateAccessToken(userObject);
                    const refreshToken = jwt.sign({userObject}, `${process.env.REFRESH_TOKEN_SECRET}`);
                    //(res, accessToken, refreshToken);
                    setSecureCookie(res, accessToken, refreshToken);
                    refreshTokens.push(refreshToken);
                  //  res.writeHead(201, {'Content-Type': 'application/json'});
                   // res.end(JSON.stringify({accessToken: accessToken, refreshToken: refreshToken}));
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

const signup = async (req, res) => {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        console.log('cream om');

        req.on('end', async () => {
            try {

                const userData = JSON.parse(body);
                console.log(userData);
                // Validate the required fields (username, password)
                if (!userData.username || !userData.password) {
                    res.writeHead(400, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Username and password are required'}));
                    return;
                }

                if(userData.password !== userData.confirmPassword){
                    res.writeHead(400, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Passwords do not match'}));
                    return;
                }

                // Check if the username is valid
                const existingUser = await userRepository.getUser(userData.username);
                if (existingUser) {
                    res.writeHead(401, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'User already exists'}));
                    return;
                }

                const hashedPassword = new AuthenticationModel(userData.password);
                const createUserData = {username: userData.username, passwordHash: hashedPassword.password, salt: hashedPassword.salt};
                await userRepository.addUser(createUserData);
                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({success: 'Account created successfully'}));

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
        const {url, headers} = req;
        const cookies = cookie.parse(headers.cookie || '');

        const accessToken = cookies.access_token;
        const refreshToken = cookies.refresh_token;

        if (refreshToken == null) {
            res.writeHead(401, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Unauthorized'}));
            return;
        }
        if (!refreshTokens.includes(refreshToken)) {
            const index = refreshTokens.indexOf(refreshToken);
            refreshTokens.splice(index, 1);
            res.writeHead(403, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Forbidden'}));
            return;

        }
        jwt.verify(refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`, (err, user) => {
            if (err) {

                res.writeHead(403, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Forbidden'}));
                return;
            }
            const accessToken = generateAccessToken(user);
            setCookie(res, accessToken, refreshToken);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({accessToken: accessToken}));
        });

    } catch (error) {
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }

}


function generateAccessToken(user) {
    return jwt.sign({user}, `${process.env.ACCESS_TOKEN_SECRET}`, {expiresIn: '3h'});
}

function setCookie(res, accessToken, refreshToken) {
    res.setHeader('Set-Cookie', [
        cookie.serialize('access_token', `${accessToken}`, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 3600,
            path: '/',
        }),
        cookie.serialize('refresh_token', `${refreshToken}`, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 86400 * 30,
            path: '/', // Adjust the path as per your requirements
        }),
       /* cookie.serialize('exclude_cookie', 'true', {
            path: '/login', // Specific path to exclude
            // Other cookie options
        }),
        cookie.serialize('exclude_cookie', 'true', {
            path: '/signup', // Specific path to exclude
            // Other cookie options
        }),*/
        cookie.serialize('a', "b", {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 86400 * 30,
            path: '/', // Adjust the path as per your requirements
        })
    ]);

}


function setSecureCookie(res, accessToken, refreshToken) {
    res.setHeader('Set-Cookie', [
        `access_token=${accessToken}; Secure; HttpOnly; SameSite=Strict`,
        `refresh_token=${refreshToken}; Secure; HttpOnly; SameSite=Strict`
    ]);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Authentication successful');
}
const logout = async (req, res) => {
    try {
        const {url, headers} = req;
        const cookies = cookie.parse(headers.cookie || '');

        const accessToken = cookies.access_token;
        const refreshToken = cookies.refresh_token;

        if (accessToken == null) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Internal Server Error'}));
            return;
        }
        if (refreshTokens.includes(refreshToken)) {
            console.log("aici");
            const index = refreshTokens.indexOf(refreshToken);
            refreshTokens.splice(index, 1);

            bannedAccessTokens.push(accessToken);
            res.writeHead(204, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({bannedAccessTokens : bannedAccessTokens}));
            return;
        }
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));


    } catch (error) {
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

module.exports = {
    login,
    token,
    logout,
    signup
}