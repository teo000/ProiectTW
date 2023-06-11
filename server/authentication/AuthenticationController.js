//login & authenticate token functions
const userRepository = require("../repositories/UserRepository");
const {User} = require("../models/UserModel");
const {checkPasswordValidity} = require("../models/AuthenticationModel");
const jwt = require("jsonwebtoken");

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
                const userObject = new User(existingUser.ID, existingUser.username, existingUser.email, existingUser.passwordhash, existingUser.salt);
                if (!existingUser) {
                    res.writeHead(401, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Username incorrect!'}));
                    return;
                }
                //check if the password is valid
                const isValid = await checkPasswordValidity(userObject, userData.password);
                if(isValid)
                {
                    //create json webtoken
                    const accessToken = jwt.sign({userObject}, `${process.env.ACCESS_TOKEN_SECRET}`)
                    res.writeHead(201, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({accessToken: accessToken}));
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

function authenticateToken (req,res,next,...args){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null)
        return res.writeHead(401, {'Content-Type' : 'text/html'}).end("<h1>Unauthorized</h1>");

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
        if(err) {
            return res.writeHead(403, {'Content-Type' : 'text/html'}).end("<h1>Forbidden</h1>");
        }
        req.user= user;
        next(req,res,...args);
    })
}
module.exports = {
    login,
    authenticateToken
}