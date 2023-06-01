const queries = require('../database/queries.js');
const AuthenticationModel = require('./AuthenticationModel')
//totul din clasa asta, mai putin user, tb sa mut in userrepository
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
        const newUser = new User(null, userData.username, userData.email, userData.password);
        return await queries.createUser(newUser);
    } catch (error) {
        throw error;
    }
}

class User {
    constructor(ID, username, email, password) {
        this.ID = ID;
        this.username = username;
        this.email = email;
        const authModel = new AuthenticationModel(password);
        this.passwordHash = authModel.password;
        this.salt = authModel.salt;
    }

}

module.exports = {
    getAllUsers,
    User,
    getUser,
    addUser
};