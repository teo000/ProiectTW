const {User} = require('../models/UserModel');
const queries = require('../database/queries.js');
const {AuthenticationModel} = require('../models/AuthenticationModel');

const getAllUsers = () => {
    return queries.getUsers();
};

const getUser = (username) => {
    return queries.getUserByUsername(username).then((users) =>{
        return users.length ? users[0] : null;
    });
}

const addUser = async (userData) => {
    try {
        const newAuthModel = new AuthenticationModel(userData.password);
        const newUser = new User(null, userData.username, userData.email, newAuthModel.password, newAuthModel.salt);
        return await queries.createUser(newUser);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllUsers,
    getUser,
    addUser
}