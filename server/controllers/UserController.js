const userModel = require('../models/UserModel');
const userRepository = require('../repositories/UserRepository');
const {checkPasswordValidity, AuthenticationModel} = require("../models/AuthenticationModel");
const {User} = require("../models/UserModel");
const AuthenticationController = require('../authentication/AuthenticationController')
var concat = require('concat-stream')
const jwt = require('jsonwebtoken');
const {getUserFromCookie} = require("../../helpers/TokenAuthenticator");

function getStringJson(text) {
    var json = {}, text = text.split("&");
    for (let i in text) {
        let box = text[i].split("=");
        json[box[0]] = box[1];
    }
    return JSON.stringify(json);
}

//@route GET /users/getAll
const getAllUsers = async (req, res) => {
    try {
        const users = await userRepository.getAllUsers();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(users));
    } catch (error) {
        console.log(error.message);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
};

//@route GET /users/{username}
const getUser = async (req, res, username) => {
    try {
        const user = await userRepository.getUser(username);
        if (!user) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'User not found!'}));
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(user));
        }
    } catch (error) {
        console.log(error);
    }
}
//@route POST /users/user
const createUser = async (req, res) => {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            console.log(body);
        });
        req.on('end', async () => {
            try {
                const jsonString = getStringJson(body);
                const userData = JSON.parse(jsonString);
                console.log(userData);
                // Validate the required fields (username, password)
                if (!userData.username || !userData.password) {
                    res.writeHead(400, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Username and password are required'}));
                    return;
                }

                // Check if the user already exists
                const existingUser = await userRepository.getUser(userData.username);
                if (existingUser) {
                    res.writeHead(409, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Username already exists'}));
                    return;
                }

                authData = new AuthenticationModel(userData.password);
                console.log(authData);
                const userToAdd = {
                    username: userData.username,
                    passwordHash: authData.password,
                    salt: authData.salt,
                    email: null
                };
                console.log(userToAdd);
                // Add the user to the database
                const addedUser = await userRepository.addUser(userToAdd);
                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'User added successfully', user: addedUser}));
            } catch (error) {
                console.log(error);
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Internal Server Error'}));
                res.end(JSON.stringify({error: 'Internal Server Error'}));
            }
        });
    } catch (error) {
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = getUserFromCookie(req, res);
        await userRepository.deleteUser(user.ID);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'User deleted successfully'}));
    } catch (error) {
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    deleteUser
};
