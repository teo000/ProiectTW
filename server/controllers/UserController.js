const userModel = require('../models/userModel');

//@route GET /users/getAll
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    } catch (error) {
        console.log(error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
};

//@route GET /users/{username}
const getUser  = async (req, res,username) =>{
    try{
        const user = await userModel.getUser(username);
        if(!user){
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User not found!' }));
        }else{
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
        }
    }
    catch(error){
        console.log(error);
    }
}
module.exports = {
    getAllUsers,
    getUser
};
