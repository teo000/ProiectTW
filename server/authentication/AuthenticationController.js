//login & authenticate token functions
const nodemailer = require('nodemailer');
const userRepository = require("../repositories/UserRepository");
const {User} = require("../models/UserModel");
const {checkPasswordValidity, AuthenticationModel} = require("../models/AuthenticationModel");
const jwt = require("jsonwebtoken");
const cookie = require('cookie');
const {getUser} = require("../repositories/UserRepository");
const {use} = require("bcrypt/promises");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
                if (!userData.username || !userData.password ) {
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
                const userObject = new User(existingUser.id, existingUser.username, existingUser.email, existingUser.passwordhash, existingUser.salt, existingUser.isadmin);
                console.log(`authentication:`);
                console.log( existingUser);

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

                if(!emailPattern.test(userData.email)){
                    res.writeHead(400, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Please enter a valid email'}));
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
                const createUserData = {username: userData.username, email: userData.email, passwordHash: hashedPassword.password, salt: hashedPassword.salt, isAdmin: false};
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

const requestResetPassword = async (req, res) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: 'smtp.gmail.com',
        port: 5887,
        secure: false,
        auth: {
            user: 'boobookreviewer@gmail.com',
            pass: 'lvpzivpekvulevzr'
        }
    });


    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const userData = JSON.parse(body);
                console.log(userData);

                const user = await getUser(userData.username);
                console.log(user);

                if(user.email === null || user.email === undefined){
                    res.writeHead(400, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'We could not process your request'}));
                    return;
                }
                const code = await addResetPasswordCode(user);
                const mailOptions = {
                    from: 'boobookreviewer@gmail.com',
                    to: `${user.email}`,
                    subject: 'Password Reset',
                    //text: 'Test email'
                    html: `
                        <h1>Password Reset</h1>
                        <p>Hello,</p>
                        <p>We received a request to reset your password. Click the link below to proceed with the password reset:</p>
                        <a href="http://localhost:8081/resetpassword?code=${code}">Reset Password</a>
                        <p>If you did not request this password reset, please ignore this email.</p>
                        <p>Best regards,</p>
                        <p>The Boo Team</p>
                         `
                };

                await transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        res.writeHead(400, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({error: 'Error while sending mail'}));
                    } else {
                        console.log('Email sent successfully!');
                        console.log('Message ID:', info.messageId);
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({error: 'Email sent successfully'}));
                    }
                });



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

const addResetPasswordCode = async(user) =>{
    //create code for password reset : up to a 10 digit number
    const code = Math.floor(Math.random()*(9999999999-1000000000));
    //add the code to the user
    await userRepository.addResetPasswordCode (user.id, code);
    return code;
}
const adminsignup = async (req, res) => {
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
                if (userData.adminCode !== 'carti123'){
                    res.writeHead(401, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'The code you have entered is incorrect'}));
                    return;
                }

                const hashedPassword = new AuthenticationModel(userData.password);
                const createUserData = {username: userData.username, passwordHash: hashedPassword.password, salt: hashedPassword.salt, isAdmin: true};
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
            path: '/'
        }),
        cookie.serialize('a', "b", {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 86400 * 30,
            path: '/'
        })
    ]);

}


function setSecureCookie(res, accessToken, refreshToken) {
    const maxAge = 86400*30;
    res.setHeader('Set-Cookie', [
        `access_token=${accessToken}; Secure; HttpOnly; SameSite=Strict; Max-Age : ${maxAge}`,
        `refresh_token=${refreshToken}; Secure; HttpOnly; SameSite=Strict;  Max-Age : ${maxAge}`
    ]);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Authentication successful');
}
function unsetCookies (res){
    const maxAge = 86400*30;
    res.setHeader('Set-Cookie', [
        `access_token=; Secure; HttpOnly; SameSite=Strict; Max-Age : ${maxAge}`,
        `refresh_token=; Secure; HttpOnly; SameSite=Strict;  Max-Age : ${maxAge}`
    ]);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Logout successful');
}
const logout = async (req, res) => {
    console.log('logout');
    try {
        const {url, headers} = req;
        const cookies = cookie.parse(headers.cookie || '');

        const accessToken = cookies.access_token;
        const refreshToken = cookies.refresh_token;

        if (accessToken == null) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            console.log('nu e logat');
            res.end(JSON.stringify({error: 'Internal Server Error'}));
            return;
        }
        if (refreshTokens.includes(refreshToken)) {
            console.log("aici");
            const index = refreshTokens.indexOf(refreshToken);
            refreshTokens.splice(index, 1);

            bannedAccessTokens.push(accessToken);
            unsetCookies(res);
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
const resetPassword = async (req, res) => {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

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
                if (!existingUser) {
                    res.writeHead(404, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'User does not exist'}));
                    return;
                }
                //check if the code provided
                // is the same as the one in the database
                const resetCodeFromDb = existingUser.reset_password_code;

                if(userData.resetCode !== resetCodeFromDb || !userData.resetCode){
                    res.writeHead(401, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'You are not authorized to perform this operation'}));
                    return;
                }

                const hashedPassword = new AuthenticationModel(userData.password);
                const data = {username: userData.username, passwordHash: hashedPassword.password, salt: hashedPassword.salt};
                await userRepository.resetPassword(data);
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

module.exports = {
    login,
    token,
    logout,
    signup,
    adminsignup,
    resetPassword,
    requestResetPassword
}